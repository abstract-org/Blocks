import React from 'react';
import { BaseModal } from '../components';

export const IMAGE = {
  Icon: () => <div>Image</div>,
  initialValue: '',
  convertString: null,
  View: (params: { content: string; onChange: (content: string) => void }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div>
        <div onClick={() => setIsOpen(true)} className='w-9/12 max-w-6xl'>
          <img
            src={params.content || 'https://res.cloudinary.com/dgft70etn/image/upload/v1650810106/ImageUploads/e9ezl1KHOn32q3sU2wTyP_blob.jpg'}
            alt={params.content}
            className='w-full object-contain'
          />
        </div>
        <div>
          <BaseModal
            desktopMaxWidth='lg'
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            renderContent={onClose => {
              if (window.top) {
                window.top.onmessage = (e: MessageEvent<any>) => {
                  if (e.data.file) {
                    params.onChange(e.data.file.url);
                    onClose();
                  }
                };
              } else {
                window.onmessage = (e: MessageEvent<any>) => {
                  if (e.data.file) {
                    params.onChange(e.data.file.url);
                    onClose();
                  }
                };
              }
              return (
                <iframe
                  src='https://tebra-media-center-3the2xxjta-uc.a.run.app/'
                  frameBorder='0'
                  className='h-full w-full bg-black absolute top-0 left-0 right-0 bottom-0'
                ></iframe>
              );
            }}
          />
        </div>
      </div>
    );
  }
};