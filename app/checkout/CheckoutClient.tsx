'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CreditCard, ShieldCheck, MapPin, User, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

type Step = 'IDENTIFICATION' | 'ADDRESS' | 'PAYMENT' | 'CONFIRMATION';

export default function CheckoutClient() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [step, setStep] = useState<Step>('IDENTIFICATION');
  const [loadingCep, setLoadingCep] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    paymentMethod: 'PIX'
  });

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 15.00;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const checkCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleFinalize = () => {
    const message = encodeURIComponent(
      `🔥 *NOVO PEDIDO - Oldisco* 🔥\n\n` +
      `*CLIENTE:* ${formData.name}\n` +
      `*CONTATO:* ${formData.phone}\n\n` +
      `*ITENS:* \n${items.map(i => `- ${i.quantity}x ${i.artist} - ${i.album}`).join('\n')}\n\n` +
      `*PAGAMENTO:* ${formData.paymentMethod}\n` +
      `*TOTAL:* R$ ${total.toFixed(2)}\n\n` +
      `*ENDEREÇO:* ${formData.street}, ${formData.number} - ${formData.city}/${formData.state}`
    );
    window.open(`https://wa.me/5531985555017?text=${message}`, '_blank');
    clearCart();
    router.push('/');
  };

  if (items.length === 0 && step !== 'CONFIRMATION') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag size={64} className="text-zinc-800 mb-6" />
        <h2 className="text-4xl font-metal mb-4">CARRINHO VAZIO</h2>
        <button onClick={() => router.push('/')} className="text-red-600 font-black tracking-widest hover:underline">VOLTAR AO SELO</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-40 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      {/* Fluxo de Checkout */}
      <div className="lg:col-span-8 space-y-12">
        {/* Progress Bar Brutalista */}
        <div className="flex justify-between relative mb-16">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-800 -z-10"></div>
          {['IDENTIFICATION', 'ADDRESS', 'PAYMENT', 'CONFIRMATION'].map((s, idx) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all duration-500 bg-black ${
                step === s ? 'border-red-600 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-125' : 
                'border-zinc-800 text-zinc-600'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-[8px] font-black tracking-widest mt-3 uppercase ${step === s ? 'text-white' : 'text-zinc-700'}`}>
                {s.slice(0, 3)}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {step === 'IDENTIFICATION' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-metal tracking-widest flex items-center gap-3">
                <User className="text-red-600" /> IDENTIFICAÇÃO DO DEVOTO
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">Nome Completo</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} placeholder="SEU NOME" className="w-full bg-black border border-zinc-800 p-4 font-mono text-sm focus:border-red-600 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">E-mail</label>
                  <input name="email" value={formData.email} onChange={handleInputChange} placeholder="MORTE@METAL.COM" className="w-full bg-black border border-zinc-800 p-4 font-mono text-sm focus:border-red-600 outline-none transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">WhatsApp / Celular</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(00) 00000-0000" className="w-full bg-black border border-zinc-800 p-4 font-mono text-sm focus:border-red-600 outline-none transition-all" />
                </div>
              </div>
              <button onClick={() => setStep('ADDRESS')} className="w-full md:w-auto px-12 py-4 bg-red-600 text-white font-black tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-500 transition-all">
                PRÓXIMA ETAPA <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 'ADDRESS' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-metal tracking-widest flex items-center gap-3">
                <MapPin className="text-red-600" /> ENDEREÇO DE DESCARGA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">CEP</label>
                  <input 
                    name="cep" 
                    value={formData.cep} 
                    onChange={(e) => {
                      handleInputChange(e);
                      if(e.target.value.length >= 8) checkCep(e.target.value);
                    }} 
                    placeholder="00000-000" 
                    className={`w-full bg-black border ${loadingCep ? 'border-red-600 animate-pulse' : 'border-zinc-800'} p-4 font-mono text-sm outline-none`} 
                  />
                </div>
                <div className="md:col-span-4 space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">Rua / Logradouro</label>
                  <input name="street" value={formData.street} onChange={handleInputChange} className="w-full bg-black border border-zinc-800 p-4 font-mono text-sm outline-none" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">Número</label>
                  <input name="number" value={formData.number} onChange={handleInputChange} className="w-full bg-black border border-zinc-800 p-4 font-mono text-sm outline-none" />
                </div>
                <div className="md:col-span-4 space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">Cidade / UF</label>
                  <input value={`${formData.city} - ${formData.state}`} readOnly className="w-full bg-zinc-900 border border-zinc-800 p-4 font-mono text-sm text-zinc-500 outline-none" />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('IDENTIFICATION')} className="px-6 py-4 border border-zinc-800 text-zinc-500 hover:text-white transition-all"><ArrowLeft size={16}/></button>
                <button onClick={() => setStep('PAYMENT')} className="flex-1 py-4 bg-red-600 text-white font-black tracking-widest text-xs flex items-center justify-center gap-2">CONTINUAR PARA PAGAMENTO</button>
              </div>
            </div>
          )}

          {step === 'PAYMENT' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-metal tracking-widest flex items-center gap-3">
                <CreditCard className="text-red-600" /> TRIBUTO (PAGAMENTO)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['PIX', 'CARTÃO', 'BOLETO'].map(method => (
                  <button 
                    key={method}
                    onClick={() => setFormData(prev => ({...prev, paymentMethod: method}))}
                    className={`p-6 border-2 font-black tracking-widest text-xs transition-all ${
                      formData.paymentMethod === method ? 'border-red-600 bg-red-900/10 text-white' : 'border-zinc-900 text-zinc-600 hover:border-zinc-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
              <div className="p-4 bg-zinc-900/50 border-l-2 border-red-600 text-[10px] font-mono text-zinc-400 italic">
                * O pagamento via PIX garante envio imediato após confirmação.
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('ADDRESS')} className="px-6 py-4 border border-zinc-800 text-zinc-500 hover:text-white transition-all"><ArrowLeft size={16}/></button>
                <button onClick={() => setStep('CONFIRMATION')} className="flex-1 py-4 bg-red-600 text-white font-black tracking-widest text-xs flex items-center justify-center gap-2">REVISAR PEDIDO</button>
              </div>
            </div>
          )}

          {step === 'CONFIRMATION' && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <ShieldCheck size={48} className="mx-auto text-red-600" />
                <h3 className="text-3xl font-metal tracking-widest">CONFIRMAÇÃO DO RITUAL</h3>
                <p className="text-zinc-500 font-mono text-xs max-w-sm mx-auto">
                  Ao clicar no botão abaixo, você será redirecionado para o WhatsApp do selo para finalizar os detalhes.
                </p>
              </div>

              <div className="border border-zinc-900 p-6 space-y-4 bg-black">
                 <div className="flex justify-between text-[10px] font-black text-zinc-500 tracking-widest uppercase border-b border-zinc-900 pb-2">
                    <span>Destinatário</span>
                    <span>Pagamento</span>
                 </div>
                 <div className="flex justify-between font-mono text-sm text-white">
                    <span>{formData.name}</span>
                    <span className="text-red-600">{formData.paymentMethod}</span>
                 </div>
                 <div className="text-[10px] font-mono text-zinc-500 uppercase">
                    {formData.street}, {formData.number} • {formData.city}
                 </div>
              </div>

              <button 
                onClick={handleFinalize}
                className="w-full py-6 bg-red-600 text-white font-black tracking-[0.3em] text-sm shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                FINALIZAR RITUAL VIA WHATSAPP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar de Resumo */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm sticky top-32">
          <h4 className="text-lg font-metal tracking-widest border-b border-zinc-900 pb-4 mb-6">RESUMO DO ARSENAL</h4>
          <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                 <img src={item.image} className="w-12 h-12 object-cover grayscale brightness-75 border border-zinc-800" alt={item.album} />
                 <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-white truncate uppercase">{item.artist}</p>
                    <p className="text-[9px] font-mono text-zinc-600 truncate">{item.quantity}x {item.album}</p>
                 </div>
                 <span className="text-xs font-mono text-zinc-400">R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 font-mono text-[11px] border-t border-zinc-900 pt-6">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Logística (Frete)</span>
              <span>R$ {shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-white pt-4 border-t border-zinc-900">
              <span className="font-metal tracking-widest">TOTAL</span>
              <span className="text-red-600">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-[8px] font-black text-zinc-700 tracking-[0.2em] uppercase">
             <ShieldCheck size={12} /> Transação Criptografada via WhatsApp
          </div>
        </div>
      </div>
    </div>
  );
}

