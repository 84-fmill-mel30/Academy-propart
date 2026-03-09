import React, { useState, useRef, useEffect } from 'react';
import { 
  Type, Image as ImageIcon, Search, Monitor, Smartphone, 
  Layers, Move, Download, Share2, Copy, Trash2, 
  Bold, Italic, AlignLeft, Box, Check, X,
  Palette, ZoomIn, ZoomOut, RotateCw
} from 'lucide-react';

/* --- PROPART DESIGN STUDIO ---
   Paleta: Dark Industrial (Suave pero mamalona).
   Funciones: Editor de nodos, capas, textos, imágenes, marcos de dispositivos y 3D.
*/

// Tamaños de Lienzo (Plantillas)
const TEMPLATES = [
  { id: 'square', name: 'App Icon / Instagram', width: 500, height: 500 },
  { id: 'moto', name: 'Motorola / Android Screen', width: 360, height: 800 },
  { id: 'wide', name: 'Portada Web', width: 800, height: 450 },
];

// Fuentes disponibles
const FONTS = [
  { name: 'Modern Sans', value: 'sans-serif' },
  { name: 'Elegante Serif', value: 'serif' },
  { name: 'Cursiva (Inglés)', value: 'cursive' },
  { name: 'Máquina (Abecedario)', value: 'monospace' },
];

export default function PropartDesignStudio() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [canvasBg, setCanvasBg] = useState('#ffffff');
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // --- FUNCIONES CORE DEL EDITOR ---
  
  const addText = () => {
    const newElement = {
      id: crypto.randomUUID(), type: 'text', content: 'Escribe aquí...',
      x: 50, y: 50, width: 200, height: 'auto',
      color: '#000000', fontSize: 24, fontFamily: 'sans-serif', fontWeight: 'normal',
      zIndex: elements.length + 1, rotation: 0, is3D: false
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const addImage = (url = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80") => {
    const newElement = {
      id: crypto.randomUUID(), type: 'image', src: url,
      x: 50, y: 50, width: 200, height: 200,
      zIndex: elements.length + 1, rotation: 0, is3D: false, borderRadius: 0
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const updateElement = (id, updates) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedId(null);
  };

  const moveZIndex = (id, direction) => {
    const current = elements.find(el => el.id === id);
    if (!current) return;
    updateElement(id, { zIndex: current.zIndex + direction });
  };

  // --- DRAG & DROP LOGIC ---
  const handlePointerDown = (e, el) => {
    setSelectedId(el.id);
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = template.width / rect.width;
    const scaleY = template.height / rect.height;
    
    setDragOffset({
      x: (e.clientX - rect.left) * scaleX - el.x,
      y: (e.clientY - rect.top) * scaleY - el.y
    });
    e.stopPropagation();
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !selectedId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = template.width / rect.width;
    const scaleY = template.height / rect.height;
    
    const newX = (e.clientX - rect.left) * scaleX - dragOffset.x;
    const newY = (e.clientY - rect.top) * scaleY - dragOffset.y;
    
    updateElement(selectedId, { x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // --- BUSCADOR SIMULADO (GOOGLE IMAGES) ---
  const searchImages = (e) => {
    e.preventDefault();
    // Simulación de búsqueda (En la vida real aquí va la API)
    setSearchResults([
      `https://source.unsplash.com/random/400x400?${searchTerm}&sig=1`,
      `https://source.unsplash.com/random/400x400?${searchTerm}&sig=2`,
      `https://source.unsplash.com/random/400x400?${searchTerm}&sig=3`,
      `https://source.unsplash.com/random/400x400?${searchTerm}&sig=4`,
    ]);
  };

  // --- EXPORTAR ---
  const handleExport = () => {
    alert("JULS: Socio, preparando la imagen final... (En versión nativa esto descargará el PNG directamente a tu galería).");
  };

  const selectedEl = elements.find(el => el.id === selectedId);

  return (
    <div className="h-screen bg-[#0a0a0c] text-slate-300 flex flex-col font-sans overflow-hidden">
      
      {/* HEADER / TOOLBAR SUPERIOR */}
      <header className="h-16 bg-[#121215] border-b border-white/5 flex justify-between items-center px-6 z-20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d4af37] rounded-lg flex items-center justify-center text-black font-black">
            P
          </div>
          <h1 className="text-white font-bold tracking-widest text-sm uppercase">Propart <span className="text-[#d4af37]">Studio</span></h1>
        </div>

        {/* ACCIONES DE EXPORTACIÓN */}
        <div className="flex gap-3">
           <button onClick={() => alert("Copiado al portapapeles.")} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Copiar"><Copy size={18} /></button>
           <a href={`https://wa.me/?text=Checa%20este%20diseño%20desde%20Propart%20Studio`} target="_blank" rel="noreferrer" className="p-2 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 rounded-lg transition-colors" title="Enviar por WhatsApp"><Share2 size={18} /></a>
           <button onClick={handleExport} className="flex items-center gap-2 bg-[#d4af37] text-black px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#b8952d] transition-colors"><Download size={16} /> GUARDAR MOCKUP</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR IZQUIERDA: HERRAMIENTAS Y PLANTILLAS */}
        <aside className="w-72 bg-[#121215] border-r border-white/5 flex flex-col overflow-y-auto">
          
          {/* Añadir Elementos */}
          <div className="p-5 border-b border-white/5 space-y-3">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Insertar</h3>
             <button onClick={addText} className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors">
                <Type size={20} className="text-[#d4af37]" /> <span className="text-sm font-bold">Cuadro de Texto</span>
             </button>
             <button onClick={() => addImage()} className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors">
                <ImageIcon size={20} className="text-[#4facfe]" /> <span className="text-sm font-bold">Imagen Vinculada</span>
             </button>
          </div>

          {/* Plantillas y "Telefonito" */}
          <div className="p-5 border-b border-white/5 space-y-3">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Dispositivo / Mockup</h3>
             <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setTemplate(t)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border ${template.id === t.id ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]' : 'bg-black/50 border-white/5 text-slate-500 hover:text-white'}`}
                  >
                    {t.id === 'moto' ? <Smartphone size={20} /> : t.id === 'square' ? <Box size={20} /> : <Monitor size={20} />}
                  </button>
                ))}
             </div>
             <p className="text-[10px] text-slate-500 text-center">Modo actual: {template.name}</p>
          </div>

          {/* Buscador de Imágenes de Internet */}
          <div className="p-5 flex-1 flex flex-col">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Buscador Web</h3>
             <form onSubmit={searchImages} className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Ej: Motor V8, Carro..."
                  className="w-full bg-black border border-white/10 rounded-lg pl-10 pr-3 py-2 text-xs text-white focus:border-[#d4af37] outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </form>
             <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 custom-scroll pr-1">
                {searchResults.map((url, i) => (
                  <img 
                    key={i} src={url} alt="Search result" 
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:border-2 border-[#d4af37] transition-all"
                    onClick={() => addImage(url)}
                  />
                ))}
             </div>
          </div>
        </aside>

        {/* ÁREA CENTRAL: EL LIENZO (CANVAS) */}
        <main 
          className="flex-1 bg-[#0a0a0c] flex items-center justify-center overflow-auto relative p-8"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Controles de Fondo del Lienzo */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#121215] p-2 rounded-xl border border-white/5 z-10">
             <span className="text-[10px] font-bold uppercase text-slate-500 mr-2">Fondo:</span>
             <button onClick={() => setCanvasBg('#ffffff')} className={`w-6 h-6 rounded-full bg-white border-2 ${canvasBg === '#ffffff' ? 'border-[#d4af37]' : 'border-transparent'}`}></button>
             <button onClick={() => setCanvasBg('#000000')} className={`w-6 h-6 rounded-full bg-black border-2 ${canvasBg === '#000000' ? 'border-[#d4af37]' : 'border-white/20'}`}></button>
             <button onClick={() => setCanvasBg('transparent')} className={`w-6 h-6 rounded-full bg-checkered border-2 ${canvasBg === 'transparent' ? 'border-[#d4af37]' : 'border-white/20'}`} title="Transparente"></button>
          </div>

          {/* El Telefonito / Marco del Canvas */}
          <div 
            className={`relative transition-all duration-500 flex items-center justify-center ${template.id === 'moto' ? 'border-[12px] border-[#1f1f23] rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.8)]' : 'shadow-2xl'}`}
            style={{ 
              width: '100%', 
              maxWidth: template.width > 800 ? '100%' : `${template.width}px`, 
              aspectRatio: `${template.width} / ${template.height}`,
            }}
          >
            {/* Contenedor Real del Lienzo */}
            <div 
              ref={canvasRef}
              className="absolute inset-0 overflow-hidden bg-cover bg-center"
              style={{ backgroundColor: canvasBg === 'transparent' ? '#222' : canvasBg }}
              onClick={() => setSelectedId(null)}
            >
               {elements.map(el => (
                 <div
                   key={el.id}
                   onPointerDown={(e) => handlePointerDown(e, el)}
                   className={`absolute cursor-move ${selectedId === el.id ? 'ring-2 ring-[#d4af37] ring-offset-1 ring-offset-transparent' : ''}`}
                   style={{
                     left: `${(el.x / template.width) * 100}%`,
                     top: `${(el.y / template.height) * 100}%`,
                     width: el.type === 'image' ? `${(el.width / template.width) * 100}%` : 'auto',
                     height: el.type === 'image' ? `${(el.height / template.height) * 100}%` : 'auto',
                     zIndex: el.zIndex,
                     transform: `rotate(${el.rotation}deg) ${el.is3D ? 'perspective(500px) rotateX(15deg) rotateY(-15deg) scale(1.1)' : ''}`,
                     boxShadow: el.is3D ? '20px 20px 30px rgba(0,0,0,0.5)' : 'none',
                     transition: isDragging ? 'none' : 'all 0.2s ease',
                   }}
                 >
                   {el.type === 'text' && (
                     <div 
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateElement(el.id, { content: e.target.innerText })}
                        className="outline-none whitespace-pre-wrap"
                        style={{ 
                          color: el.color, 
                          fontSize: `${el.fontSize}px`, 
                          fontFamily: el.fontFamily, 
                          fontWeight: el.fontWeight,
                          minWidth: '50px'
                        }}
                     >
                       {el.content}
                     </div>
                   )}
                   {el.type === 'image' && (
                     <img 
                       src={el.src} 
                       alt="Elemento" 
                       className="w-full h-full object-cover"
                       style={{ borderRadius: `${el.borderRadius}px` }}
                       draggable={false}
                     />
                   )}
                 </div>
               ))}
            </div>
            
            {/* Muesca del Telefonito (Si es Motorola/Android) */}
            {template.id === 'moto' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1f1f23] rounded-b-2xl z-50"></div>
            )}
          </div>
        </main>

        {/* SIDEBAR DERECHA: PROPIEDADES DEL ELEMENTO (COMO EXCEL/POWERPOINT) */}
        <aside className="w-80 bg-[#121215] border-l border-white/5 overflow-y-auto">
          <div className="p-6 border-b border-white/5">
             <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Palette size={18} className="text-[#d4af37]" /> Propiedades
             </h2>
          </div>

          {!selectedEl ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              <p>Selecciona un texto o imagen en el lienzo para editar sus propiedades (color, tamaño, 3D, capas).</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
               
               {/* ACCIONES RÁPIDAS (AL FRENTE / AL FONDO / ELIMINAR) */}
               <div className="flex gap-2 bg-black/30 p-2 rounded-xl">
                 <button onClick={() => moveZIndex(selectedEl.id, 1)} className="flex-1 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-center">Subir Capa</button>
                 <button onClick={() => moveZIndex(selectedEl.id, -1)} className="flex-1 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-center">Bajar Capa</button>
                 <button onClick={() => deleteElement(selectedEl.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg"><Trash2 size={16} /></button>
               </div>

               {/* EFECTO 3D MAMALÓN */}
               <div className="bg-gradient-to-r from-[#d4af37]/20 to-transparent p-4 rounded-xl border border-[#d4af37]/30 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-white">Efecto 3D Pro</p>
                    <p className="text-[10px] text-slate-400">Rotación y sombra profunda</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={selectedEl.is3D} onChange={(e) => updateElement(selectedEl.id, { is3D: e.target.checked })} />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d4af37]"></div>
                  </label>
               </div>

               {/* CONTROLES DE TEXTO */}
               {selectedEl.type === 'text' && (
                 <>
                   <div className="space-y-3">
                     <label className="text-xs font-bold text-slate-400 uppercase">Tipografía (Letra)</label>
                     <select 
                       className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-sm text-white outline-none focus:border-[#d4af37]"
                       value={selectedEl.fontFamily}
                       onChange={(e) => updateElement(selectedEl.id, { fontFamily: e.target.value })}
                     >
                       {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                     </select>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Tamaño</label>
                       <div className="flex items-center gap-2 bg-black border border-white/10 rounded-xl p-1">
                          <button onClick={() => updateElement(selectedEl.id, { fontSize: selectedEl.fontSize - 2 })} className="p-1.5 hover:text-[#d4af37]"><ZoomOut size={16}/></button>
                          <input type="number" value={selectedEl.fontSize} onChange={(e) => updateElement(selectedEl.id, { fontSize: Number(e.target.value) })} className="w-10 bg-transparent text-center text-sm outline-none" />
                          <button onClick={() => updateElement(selectedEl.id, { fontSize: selectedEl.fontSize + 2 })} className="p-1.5 hover:text-[#d4af37]"><ZoomIn size={16}/></button>
                       </div>
                     </div>
                     <div>
                       <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Grosor</label>
                       <button 
                         onClick={() => updateElement(selectedEl.id, { fontWeight: selectedEl.fontWeight === 'bold' ? 'normal' : 'bold' })}
                         className={`w-full p-2.5 rounded-xl text-sm font-bold border transition-colors ${selectedEl.fontWeight === 'bold' ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-black text-white border-white/10 hover:border-white/30'}`}
                       >
                         Negrita Fuerte
                       </button>
                     </div>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Color (Paleta Completa)</label>
                      <input 
                        type="color" 
                        value={selectedEl.color} 
                        onChange={(e) => updateElement(selectedEl.id, { color: e.target.value })}
                        className="w-full h-12 rounded-xl cursor-pointer bg-black border border-white/10 p-1"
                      />
                   </div>
                 </>
               )}

               {/* CONTROLES DE IMAGEN */}
               {selectedEl.type === 'image' && (
                 <>
                   <div className="space-y-4">
                     <label className="text-xs font-bold text-slate-400 uppercase">Ampliar / Reducir (Ancho)</label>
                     <input 
                       type="range" min="50" max="1000" 
                       value={selectedEl.width} 
                       onChange={(e) => updateElement(selectedEl.id, { width: Number(e.target.value), height: Number(e.target.value) })} // Mantener prop
                       className="w-full accent-[#d4af37]"
                     />
                   </div>
                   <div className="space-y-4">
                     <label className="text-xs font-bold text-slate-400 uppercase">Recortar Bordes (Redondeo)</label>
                     <input 
                       type="range" min="0" max="250" 
                       value={selectedEl.borderRadius || 0} 
                       onChange={(e) => updateElement(selectedEl.id, { borderRadius: Number(e.target.value) })}
                       className="w-full accent-[#d4af37]"
                     />
                   </div>
                 </>
               )}

               {/* ROTACIÓN GENERAL */}
               <div className="space-y-4 pt-4 border-t border-white/5">
                 <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                   <RotateCw size={14} /> Girar Elemento
                 </label>
                 <input 
                   type="range" min="-180" max="180" 
                   value={selectedEl.rotation} 
                   onChange={(e) => updateElement(selectedEl.id, { rotation: Number(e.target.value) })}
                   className="w-full accent-[#d4af37]"
                 />
                 <div className="text-center text-xs text-[#d4af37] font-mono">{selectedEl.rotation}° Grados</div>
               </div>

            </div>
          )}
        </aside>
      </div>

      {/* STYLES */}
      <style>{`
        .bg-checkered {
          background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        input[type="range"] {
          -webkit-appearance: none; background: #333; height: 6px; border-radius: 5px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%; background: #d4af37; cursor: pointer;
        }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}
