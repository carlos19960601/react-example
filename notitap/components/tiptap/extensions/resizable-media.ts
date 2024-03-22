import { Node, ReactNodeViewRenderer, mergeAttributes } from "@tiptap/react";
import { ResizableMediaNodeView } from "./ResizableMediaNodeView";

export interface MediaOptions {
  HTMLAttributes: Record<string, any>;
}

export const ResizableMedia = Node.create<MediaOptions>({
  name: "resizableMedia",

  // 定义ResizableMedia.configure中可以配置的字段
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  inline: false,

  group: "block",

  draggable: true,

  selectable: true,

  // 添加元素的属性，如果只有src，则 renderHTML中HTMLAttributes就只有src，会忽略掉其他的
  // default可以指定默认值
  addAttributes() {
    return {
      src: {
        default: null,
      },
      "media-type": {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "100%",
      },
      height: {
        default: "auto",
      },
      dataAlign: {
        default: "left", // 'left' | 'center' | 'right'
      },
      dataFloat: {
        default: null, // 'left' | 'right'
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
        getAttrs: (el) => ({
          src: (el as HTMLImageElement).getAttribute("src"),
          "media-type": "img",
        }),
      },
      {
        tag: "video",
        getAttrs: (el) => ({
          src: (el as HTMLVideoElement).getAttribute("src"),
          "media-type": "video",
        }),
      },
    ];
  },


  // https://tiptap.dev/guide/custom-extensions/#render-html
  // The first value in the array should be the name of HTML tag.If the second element is an object, 
  // it’s interpreted as a set of attributes.Any elements after that are rendered as children.
  // The number zero(representing a hole) is used to indicate where the content should be inserted.
  renderHTML({ node, HTMLAttributes }) {
    const { "media-type": mediaType } = HTMLAttributes;
    if (mediaType === "img") {
      return [
        "img",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ];
    }

    if (mediaType === "video") {
      return [
        "video",
        { controls: "true", style: "width: 100%", ...HTMLAttributes },
        ["source", HTMLAttributes],
      ];
    }

    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  //@ts-ignore
  addCommands() {
    this.options; // addOptions中定义的内容
    return {
      setMedia:
        // options 是 editor.commands.setMedia()传进来的参数
        (options) =>
          ({ commands }) => {
            const { "media-type": mediaType } = options;
            if (mediaType === "img") {
              return commands.insertContent({
                type: this.name,
                attrs: options,
              });
            }
            if (mediaType === "video") {
              return commands.insertContent({
                type: this.name,
                attrs: {
                  ...options,
                  controls: "true",
                },
              });
            }


            return commands.insertContent(
              {
                type: this.name,
                attrs: options,
              }
            )
          }
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableMediaNodeView);
  },
})