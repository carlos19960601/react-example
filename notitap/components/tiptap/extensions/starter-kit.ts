import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { ResizableMedia } from './resizable-media';
interface GetExtensionsProps {
  openLinkModal: () => void;
}

export const getExtensions = ({ openLinkModal }: GetExtensionsProps) => {
  return [
    StarterKit,
    Placeholder.configure({
      placeholder: ({ node }) => {
        return "Type `/` for commands"
      },
      includeChildren: true,
    }),
    ResizableMedia.configure({}),
  ]
}