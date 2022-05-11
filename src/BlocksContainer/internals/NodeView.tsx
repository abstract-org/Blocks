import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { XIconClear, DragIcon, DropdownMenu } from '../../components';
import { BlocksMenu } from './BlocksMenu';
import classNames from 'classnames';
import { Block } from '..';
import { pipe } from '../../utils';

type NodeValue = { id: string; kind: any; content: any };

type Params = {
  node: NodeValue;
  onDelete: () => void;
  onChange: (node: NodeValue) => void;
  onAdd: (node: NodeValue) => void;
  blocks: Record<string, Block<any>>;
};

export function NodeView({ blocks, node, onAdd, onChange, onDelete }: Params) {
  const BLOCKS_WITH_KIND = Object.entries(blocks).map(([kind, node]) => ({ ...node, kind }));

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: node.id, disabled: false });

  const BlockWithKind = React.useMemo(() => BLOCKS_WITH_KIND.find(b => b.kind === node.kind), [node.kind]);

  if (!BlockWithKind) {
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
          <div className={classNames('grow-0 shrink-0 w-20 group-hover:opacity-100 duration-500 mt-1', { 'opacity-0': !isDragging })}>
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
                    items={BLOCKS_WITH_KIND.map(currBlock => {
                      return {
                        text: currBlock.kind,
                        onClick: () => {
                          const transformedValue = pipe(node.content, BlockWithKind.stringify, currBlock.parse);
                          onChange({ ...node, kind: currBlock.kind, content: transformedValue });
                        }
                      };
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div>
                <div>
                  <BlockWithKind.View content={node.content} onChange={content => onChange({ ...node, content })} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <BlocksMenu blocks={blocks} onSelect={onAdd} staticMode={false} />
      </div>
    </div>
  );
}
