import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useOnEscapeKey } from '../../hooks/useOnEscapeKey';

type ModalAlignment = 'left' | 'right' | 'top' | 'bottom' | 'center';

interface ModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  children: React.ReactNode;
  alignment?: ModalAlignment;
  width?: string;
  height?: string;
  className?: string;
  overlayClassName?: string;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  showCancelBtnINSmallDevice?: boolean;
  isIntercepting?: boolean;
  isTitle?: string;
}

const getAlignmentClasses = (alignment: ModalAlignment, isMobile: boolean) => {
  if (isMobile) return 'w-full h-full';

  switch (alignment) {
    case 'left':
      return 'absolute top-0 left-0 h-full';
    case 'right':
      return 'absolute top-0 right-0 h-full';
    case 'top':
      return 'absolute top-0 left-0 w-full';
    case 'bottom':
      return 'absolute bottom-0 left-0 w-full';
    case 'center':
    default:
      return 'relative';
  }
};

const getSizeClasses = (
  alignment: ModalAlignment,
  isMobile: boolean,
  width?: string,
  height?: string
) => {
  if (isMobile) {
    return 'w-full h-full';
  }

  switch (alignment) {
    case 'left':
    case 'right':
      return `h-full ${width ?? 'w-96'}`;
    case 'top':
    case 'bottom':
      return `w-full ${height ?? 'h-96'}`;
    case 'center':
    default:
      // for center we cap max-height to 90vh
      return `${width ?? 'w-[32rem]'} ${height ?? 'max-h-[90vh]'}`;
  }
};

export const Modal = ({
  show,
  setShow,
  children,
  alignment = 'center',
  width,
  height,
  className = '',
  overlayClassName = '',
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  showCancelBtnINSmallDevice = false,
  isIntercepting = false,
  isTitle,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useLockBodyScroll(show);
  useOnClickOutside(
    modalRef,
    () => show && closeOnOutsideClick && setShow(false)
  );
  useOnEscapeKey(() => show && closeOnEscape && setShow(false));

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!show) return null;

  return createPortal(
    <div
      className={`
        fixed inset-0 z-50
        ${isIntercepting ? 'bg-black/50' : 'bg-black/30'}
        transition-opacity duration-300
        ${show ? 'opacity-100' : 'opacity-0'}
        ${alignment === 'center' && !isMobile ? 'flex items-center justify-center' : ''}
        ${overlayClassName}
      `}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`
          ${getAlignmentClasses(alignment, isMobile)}
          ${getSizeClasses(alignment, isMobile, width, height)}
          bg-white shadow-xl
          flex flex-col          /* ← always flex-column */
          transition-all duration-300 ease-in-out
          ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          ${isMobile ? 'rounded-t-2xl' : 'rounded-lg'}
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b">
          <span className="font-bold">{isTitle}</span>
          {/* {showCancelBtnINSmallDevice && isMobile && (
            <button
              onClick={() => setShow(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          )} */}
          {showCloseButton && (
            <button
              onClick={() => setShow(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0 max-h-full">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
