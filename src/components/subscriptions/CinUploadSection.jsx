import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload, Camera, FileText, X, CheckCircle2,
  Loader2, AlertCircle, RefreshCw, Image, Eye
} from 'lucide-react';
import OcrService from '../../services/ocr/OcrService';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const ACCEPT_TYPES = 'image/jpeg,image/png,image/webp,image/heic,application/pdf';
const MAX_SIZE_MB   = 5;
const MAX_SIZE_B    = MAX_SIZE_MB * 1024 * 1024;

const isMobile = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

const fileIcon = (file) => {
  if (!file) return null;
  if (file.type === 'application/pdf') return <FileText size={20} className="text-red-500" />;
  return <Image size={20} className="text-blue-500" />;
};

const sizeLabel = (file) => {
  if (!file) return '';
  const kb = file.size / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
};

// ─── Single File Slot ──────────────────────────────────────────────────────────

const FileSlot = ({ label, file, onFile, onRemove, disabled }) => {
  const inputRef  = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) validateAndSet(f);
  }, []);

  const validateAndSet = (f) => {
    if (f.size > MAX_SIZE_B) { alert(`Fichier trop grand (max ${MAX_SIZE_MB} MB)`); return; }
    if (!ACCEPT_TYPES.includes(f.type) && f.type !== '') { alert('Format non supporté. PDF, JPG, PNG, WEBP acceptés.'); return; }
    onFile(f);
  };

  // Generate a preview URL for images
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!file || file.type === 'application/pdf') { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (file) {
    return (
      <div className="relative rounded-2xl border-2 border-emerald-200 bg-emerald-50 overflow-hidden">
        {/* Image preview */}
        {preview ? (
          <div className="relative h-28 bg-slate-100 overflow-hidden">
            <img src={preview} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <button
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-slate-600 hover:bg-white transition-all"
              onClick={() => window.open(preview, '_blank')}
              title="Voir en plein écran"
            >
              <Eye size={12} />
            </button>
          </div>
        ) : (
          <div className="h-28 bg-red-50 flex items-center justify-center">
            <FileText size={36} className="text-red-400" />
          </div>
        )}
        {/* File info */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white">
          {fileIcon(file)}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-slate-700 truncate">{file.name}</p>
            <p className="text-[9px] font-bold text-slate-400">{sizeLabel(file)}</p>
          </div>
          {!disabled && (
            <button
              className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-100 hover:text-red-500 transition-all"
              onClick={onRemove}
            >
              <X size={10} />
            </button>
          )}
        </div>
        {/* Label */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase tracking-wider">
          {label}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
        drag
          ? 'border-blue-400 bg-blue-50'
          : disabled
          ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
      }`}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={disabled ? undefined : handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={ACCEPT_TYPES}
        onChange={(e) => e.target.files[0] && validateAndSet(e.target.files[0])}
        disabled={disabled}
      />
      <Upload size={18} className="text-slate-300" />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-[9px] font-bold text-slate-300">PDF · JPG · PNG</span>
    </div>
  );
};

// ─── Camera Capture (Mobile) ───────────────────────────────────────────────────

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const streamRef  = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } })
      .then((stream) => {
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => { if (mounted) setReady(true); };
        }
      })
      .catch(() => { if (mounted) setError("Impossible d'accéder à la caméra."); });

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], `cin_camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
      streamRef.current?.getTracks().forEach(t => t.stop());
      onCapture(file);
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe-top py-3 bg-black/80">
        <span className="text-white text-sm font-black uppercase tracking-widest">Scanner la CIN</span>
        <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center" onClick={onClose}>
          <X size={16} className="text-white" />
        </button>
      </div>

      {/* Viewfinder */}
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3">
            <AlertCircle size={32} className="text-red-400" />
            <p className="text-sm font-bold text-center px-6">{error}</p>
            <button className="px-4 py-2 rounded-xl bg-white/10 text-sm font-black" onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            {/* CIN Frame guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[85%] max-w-sm" style={{ aspectRatio: '1.586/1' }}>
                {/* Corner guides */}
                {[['top-0 left-0 border-t-2 border-l-2 rounded-tl-lg', ''],
                  ['top-0 right-0 border-t-2 border-r-2 rounded-tr-lg', ''],
                  ['bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg', ''],
                  ['bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg', '']
                ].map(([cls], i) => (
                  <div key={i} className={`absolute w-8 h-8 border-white/90 ${cls}`} />
                ))}
                <div className="absolute inset-0 border border-white/20 rounded-xl" />
                <p className="absolute -bottom-8 left-0 right-0 text-center text-white/70 text-xs font-bold">
                  Alignez la carte dans le cadre
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Capture button */}
      {!error && (
        <div className="flex items-center justify-center py-8 bg-black/80">
          <button
            className={`w-18 h-18 rounded-full border-4 border-white flex items-center justify-center transition-all ${
              ready ? 'bg-white/20 active:scale-95' : 'opacity-40 cursor-not-allowed'
            }`}
            style={{ width: 72, height: 72 }}
            onClick={ready ? capture : undefined}
            disabled={!ready}
          >
            <div className="w-14 h-14 rounded-full bg-white" />
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

// ─── OCR Status Banner ─────────────────────────────────────────────────────────

const OcrBanner = ({ status, progress, cin, error, onRetry }) => {
  if (status === 'idle') return null;

  if (status === 'scanning') {
    return (
      <div className="mt-4 flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
        <Loader2 size={16} className="text-blue-500 animate-spin flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-black text-blue-700">Analyse OCR en cours…</p>
          <div className="mt-1.5 h-1 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-[10px] font-black text-blue-400">{progress}%</span>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="mt-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">CIN extrait avec succès</p>
          <p className="text-lg font-black text-emerald-800 tracking-widest mt-0.5">{cin}</p>
        </div>
        <button onClick={onRetry} className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-all" title="Rescanner">
          <RefreshCw size={12} />
        </button>
      </div>
    );
  }

  if (status === 'not_found') {
    return (
      <div className="mt-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
        <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-black text-amber-700">CIN non détecté automatiquement</p>
          <p className="text-[10px] font-bold text-amber-500 mt-0.5">Saisissez le numéro manuellement ci-dessous</p>
        </div>
        <button onClick={onRetry} className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 hover:bg-amber-200 transition-all">
          <RefreshCw size={12} />
        </button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mt-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-black text-red-700">Erreur OCR</p>
          <p className="text-[10px] font-bold text-red-400 mt-0.5">{error}</p>
        </div>
        <button onClick={onRetry} className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-all">
          <RefreshCw size={12} />
        </button>
      </div>
    );
  }

  return null;
};

// ─── Main Component ────────────────────────────────────────────────────────────

/**
 * CinUploadSection
 *
 * Props:
 *   onCinExtracted(cin: string | null)  — called with the extracted CIN (or null)
 *   onFilesChange(files: File[])        — called whenever stored files change
 *   disabled                            — locks all interactions
 */
const CinUploadSection = ({ onCinExtracted, onFilesChange, disabled = false }) => {
  const mobile = isMobile();

  // File state: recto, verso (optional), and any PDF
  const [rectoFile,  setRectoFile]  = useState(null);
  const [versoFile,  setVersoFile]  = useState(null);
  const [pdfFile,    setPdfFile]    = useState(null);

  // Camera
  const [cameraOpen,     setCameraOpen]     = useState(false);
  const [cameraTarget,   setCameraTarget]   = useState('recto'); // 'recto' | 'verso'

  // OCR state
  const [ocrStatus,   setOcrStatus]   = useState('idle'); // idle | scanning | success | not_found | error
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrCin,      setOcrCin]      = useState('');
  const [ocrError,    setOcrError]    = useState('');

  // Manual CIN field (shown when OCR not found or user wants to override)
  const [manualCin, setManualCin] = useState('');

  // Notify parent of file changes
  useEffect(() => {
    const files = [rectoFile, versoFile, pdfFile].filter(Boolean);
    onFilesChange?.(files);
  }, [rectoFile, versoFile, pdfFile]);

  // ── OCR trigger ───────────────────────────────────────────────────────────
  const runOcr = useCallback(async (file) => {
    if (!file || file.type === 'application/pdf') return; // skip PDF
    setOcrStatus('scanning');
    setOcrProgress(0);
    setOcrCin('');
    setOcrError('');
    try {
      const cin = await OcrService.extractCin(file, setOcrProgress);
      if (cin) {
        setOcrCin(cin);
        setOcrStatus('success');
        setManualCin(cin);
        onCinExtracted?.(cin);
      } else {
        setOcrStatus('not_found');
        onCinExtracted?.(null);
      }
    } catch (err) {
      setOcrStatus('error');
      setOcrError(err.message || 'Erreur inconnue');
      onCinExtracted?.(null);
    }
  }, [onCinExtracted]);

  const resetOcr = () => {
    setOcrStatus('idle');
    setOcrCin('');
    setOcrError('');
    setOcrProgress(0);
  };

  // ── File handlers ─────────────────────────────────────────────────────────
  const handleRecto = (file) => {
    setRectoFile(file);
    setPdfFile(null); // mutually exclusive with PDF
    resetOcr();
    runOcr(file);
  };

  const handleVerso = (file) => {
    setVersoFile(file);
    // Try OCR on verso if recto didn't find CIN
    if (ocrStatus !== 'success') runOcr(file);
  };

  const handlePdf = (file) => {
    setPdfFile(file);
    setRectoFile(null);
    setVersoFile(null);
    resetOcr();
    // PDFs: can't OCR directly, prompt manual entry
    setOcrStatus('not_found');
    onCinExtracted?.(null);
  };

  const handleCamera = (file, target) => {
    setCameraOpen(false);
    if (target === 'recto') handleRecto(file);
    else handleVerso(file);
  };

  // ── Manual CIN sync ───────────────────────────────────────────────────────
  const handleManualCin = (val) => {
    const upper = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setManualCin(upper);
    onCinExtracted?.(upper || null);
  };

  const showManualInput = ocrStatus === 'not_found' || ocrStatus === 'error' || ocrStatus === 'idle';
  const hasFile = rectoFile || pdfFile;

  return (
    <>
      {/* Camera modal */}
      {cameraOpen && (
        <CameraCapture
          onCapture={(file) => handleCamera(file, cameraTarget)}
          onClose={() => setCameraOpen(false)}
        />
      )}

      <div>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-5 block">
          Vérification d'identité — CIN
        </span>

        {/* ─── PDF OR IMAGES toggle ─── */}
        {!pdfFile && !rectoFile && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Upload PDF button */}
            <label className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <input
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={(e) => e.target.files[0] && handlePdf(e.target.files[0])}
                disabled={disabled}
              />
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <FileText size={20} className="text-red-400" />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
                Uploader PDF
              </span>
            </label>

            {/* Upload images button */}
            <label className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleRecto(e.target.files[0])}
                disabled={disabled}
              />
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Image size={20} className="text-blue-400" />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
                Photo CIN
              </span>
            </label>

            {/* Camera button — mobile only */}
            {mobile && (
              <button
                className={`col-span-2 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => { setCameraTarget('recto'); setCameraOpen(true); }}
                disabled={disabled}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Camera size={20} className="text-emerald-500" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Scanner avec la caméra
                </span>
              </button>
            )}
          </div>
        )}

        {/* ─── PDF uploaded ─── */}
        {pdfFile && (
          <div className="relative flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-4">
            <FileText size={28} className="text-red-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800 truncate">{pdfFile.name}</p>
              <p className="text-[10px] font-bold text-slate-400">{sizeLabel(pdfFile)}</p>
            </div>
            {!disabled && (
              <button
                className="w-7 h-7 rounded-xl bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-all"
                onClick={() => { setPdfFile(null); resetOcr(); }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* ─── Recto + Verso image slots ─── */}
        {!pdfFile && (
          <>
            <div className={`grid gap-3 mb-4 ${rectoFile ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <FileSlot
                label="Recto"
                file={rectoFile}
                onFile={handleRecto}
                onRemove={() => { setRectoFile(null); resetOcr(); }}
                disabled={disabled}
              />
              {rectoFile && (
                <FileSlot
                  label="Verso"
                  file={versoFile}
                  onFile={handleVerso}
                  onRemove={() => setVersoFile(null)}
                  disabled={disabled}
                />
              )}
            </div>

            {/* Camera buttons when image mode active on mobile */}
            {mobile && rectoFile && (
              <div className="flex gap-2 mb-4">
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-[10px] font-black text-slate-500 hover:bg-slate-50 transition-all"
                  onClick={() => { setCameraTarget('recto'); setCameraOpen(true); }}
                >
                  <Camera size={12} /> Rescanner recto
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-[10px] font-black text-slate-500 hover:bg-slate-50 transition-all"
                  onClick={() => { setCameraTarget('verso'); setCameraOpen(true); }}
                >
                  <Camera size={12} /> Scanner verso
                </button>
              </div>
            )}
          </>
        )}

        {/* ─── OCR Result Banner ─── */}
        {hasFile && (
          <OcrBanner
            status={ocrStatus}
            progress={ocrProgress}
            cin={ocrCin}
            error={ocrError}
            onRetry={() => {
              resetOcr();
              if (rectoFile) runOcr(rectoFile);
            }}
          />
        )}

        {/* ─── Manual CIN input ─── */}
        {(showManualInput || hasFile) && (
          <div className={`${hasFile ? 'mt-4' : 'mt-3'}`}>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
              Numéro CIN {ocrStatus === 'success' ? '(extrait automatiquement)' : '(saisie manuelle)'}
            </label>
            <input
              type="text"
              value={manualCin}
              onChange={(e) => handleManualCin(e.target.value)}
              placeholder="Ex: AB123456"
              maxLength={10}
              className={`w-full rounded-2xl border-2 py-3.5 px-4 text-sm font-black text-slate-900 outline-none transition-all tracking-widest ${
                ocrStatus === 'success'
                  ? 'border-emerald-300 bg-emerald-50 focus:border-emerald-400'
                  : 'border-slate-100 bg-slate-50 focus:border-blue-400 focus:bg-white'
              }`}
              disabled={disabled}
            />
            {manualCin && !/^[A-Z]{1,2}\d{4,6}$/.test(manualCin) && (
              <p className="text-[10px] font-bold text-amber-500 mt-1.5 flex items-center gap-1">
                <AlertCircle size={10} /> Format attendu : 1-2 lettres + 4-6 chiffres (ex: AB123456)
              </p>
            )}
            {manualCin && /^[A-Z]{1,2}\d{4,6}$/.test(manualCin) && (
              <p className="text-[10px] font-bold text-emerald-500 mt-1.5 flex items-center gap-1">
                <CheckCircle2 size={10} /> Format valide
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CinUploadSection;
