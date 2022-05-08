import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { XIconClear, DragIcon, DropdownMenu } from '../../components';
import { initBlocksMenu } from './BlocksMenu';
import classNames from 'classnames';
import { notEmpty } from '../../utils/notEmpty';
import { Block } from '..';
import { pipe, mapWithIndex } from '../../utils';

type NodeValue = { id: string; kind: any; content: any };

type Params = {
  node: NodeValue;
  onDelete: () => void;
  onChange: (node: NodeValue) => void;
  onAdd: (node: NodeValue) => void;
};

export const initNodeView = (blocks: Record<string, Block<any>>) => {
  const _blocks = pipe(
    blocks,
    mapWithIndex((kind, block) => ({ ...block, kind })),
    blocks => Object.values(blocks)
  );

  const BlocksMenu = initBlocksMenu(blocks);

  return ({ node, onDelete, onChange, onAdd }: Params) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: node.id, disabled: false });

    const View = React.useMemo(() => _blocks.find(b => b.kind === node.kind), [node.kind])?.View;

    if (!View) {
      return null;
    }

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        style={{
          ...(transition && { transition }),
          ...(isDragging && { zIndex: 1 }),
          transform: CSS.Transform.toString(transform ? { ...transform, scaleX: 1, scaleY: 1 } : null),

          pointerEvents: transform?.x || transform?.y ? 'none' : 'auto' // IMPORTANT: when dragging disable all inner node's events !
        }}
      >
        <div>
          <div className='flex group items-start'>
            <div className={classNames('grow-0 shrink-0 w-20 group-hover:opacity-100 duration-500 mt-8', { 'opacity-0': !isDragging })}>
              <div>
                <div className='pl-2 flex'>
                  <div className='w-5 mb-1'>
                    <XIconClear onClick={onDelete} mode='X' isDisabled={false} color='black' />
                  </div>
                  <div className='w-5' {...listeners}>
                    <DragIcon />
                  </div>
                  <div className='w-5 relative overflow-visible text-gray-dark'>
                    <DropdownMenu
                      items={_blocks
                        .map(i => (i.convertString ? { ...i, convertString: i.convertString } : null))
                        .filter(notEmpty)
                        .map(b => ({
                          text: b.kind,
                          onClick: () => onChange({ ...node, kind: b.kind, content: b.convertString(node.content) })
                        }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  {/* <div className='capitalize font-bold text-sm'>{node.kind.toLowerCase().split('_')}</div> */}
                  <div>
                    <View content={node.content} onChange={content => onChange({ ...node, content })} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <BlocksMenu onSelect={onAdd} staticMode={false} />
        </div>
      </div>
    );
  };
};
