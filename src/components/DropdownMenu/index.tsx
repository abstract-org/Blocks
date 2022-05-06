import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '../';
import { useOutside } from '../../utils/useOutside';

type Params = {
  items: Array<{
    text: string;
    onClick: () => void;
  }>;
};

export function DropdownMenu({ items }: Params) {
  const [isOpen, setIsOpen] = React.useState<null | { x: number; y: number }>(null);

  const ref = React.useRef<HTMLDivElement>(null);

  useOutside([ref], () => setIsOpen(null), [isOpen]);

  return (
    <div>
      <div className='relative inline-block text-left'>
        <div
          className='w-5'
          onClick={e => {
            setIsOpen({ x: e.pageX, y: e.pageY });
          }}
        >
          <div className='inline-flex w-full justify-center rounded-md bg-opacity-20 text-gray-dark  text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            <DotsVerticalIcon />
          </div>
        </div>

        <Transition show={!!isOpen} as={Fragment}>
          <div className='fixed inset-0 z-30' onMouseLeave={() => setIsOpen(null)}>
            {!!isOpen && (
              <div
                ref={ref}
                className='px-1 py-1 w-28 bg-white relative z-30 mt-2 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                style={{ ...(!!isOpen && { top: isOpen.y + 10, left: isOpen.x + 10 }) }}
              >
                {items.map(i => {
                  return (
                    <div key={i.text}>
                      <button
                        onClick={i.onClick}
                        className={`group flex w-full items-center rounded-md px-2 py-2 text-sm capitalize text-left text-black opacity-70 hover:opacity-100`}
                      >
                        {i.text.toLowerCase().split('_').join(' ')}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Transition>
      </div>
    </div>
  );
}