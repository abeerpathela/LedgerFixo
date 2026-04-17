import React, { useState } from 'react';
import { Send, Paperclip, MoreVertical, Search, CheckCheck, FileText } from 'lucide-react';

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'client', text: 'Hey Abeer, I just saw the invoice for the UI project.', time: '10:30 AM' },
        { id: 2, sender: 'me', text: 'Hi! Let me know if you have any questions regarding the tax breakdown.', time: '10:35 AM' },
        { id: 3, sender: 'client', text: 'The IGST looks correct. Can you also send the breakdown for the backend task?', time: '10:40 AM' },
        { id: 4, sender: 'me', type: 'invoice', invoiceId: 'INV-2024-002', status: 'Sent', amount: '45,200', time: '10:45 AM' },
    ]);

    const clients = [
        { name: 'Acme Corp', lastMsg: 'The IGST looks correct...', time: '10:40 AM', active: true, unread: 0 },
        { name: 'Global Tech', lastMsg: 'Invoice paid, thank you!', time: 'Yesterday', unread: 2 },
        { name: 'Janice Miller', lastMsg: 'Can we hop on a call?', time: 'Jan 28', unread: 0 },
    ];

    return (
        <div className="h-[calc(100vh-160px)] flex gap-6">
            <div className="w-80 bg-white rounded-xl shadow-soft border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/10"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {clients.map((c, i) => (
                        <div key={i} className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${c.active ? 'bg-blue-50/50 border-r-4 border-primary' : ''}`}>
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-gray-500">
                                {c.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-bold text-gray-900 truncate">{c.name}</h3>
                                    <span className="text-[10px] text-gray-400">{c.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate mt-1">{c.lastMsg}</p>
                            </div>
                            {c.unread > 0 && (
                                <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center self-center">{c.unread}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-soft border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">A</div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Acme Corporation</h3>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Online</p>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-90">
                    {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] group`}>
                                {m.type === 'invoice' ? (
                                    <div className="bg-white border-2 border-primary/20 rounded-2xl p-4 shadow-soft">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="p-2 bg-blue-50 text-primary rounded-lg">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-primary uppercase">{m.invoiceId}</p>
                                                <p className="text-sm font-bold text-gray-900 mt-0.5">₹{m.amount}</p>
                                            </div>
                                            <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase">{m.status}</span>
                                        </div>
                                        <button className="w-full btn-primary py-2 text-xs">View Invoice</button>
                                        <p className="text-[10px] text-gray-400 mt-2 text-right">{m.time}</p>
                                    </div>
                                ) : (
                                    <div className={`p-4 rounded-2xl text-sm ${m.sender === 'me'
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                                        }`}>
                                        {m.text}
                                        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${m.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {m.time}
                                            {m.sender === 'me' && <CheckCheck size={12} />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Paperclip size={20} /></button>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 bg-transparent border-none outline-none text-sm px-2"
                        />
                        <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-all transform active:scale-90">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
