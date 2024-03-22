import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";

// ! had to manage this state outside of the component because `useState` isn't fast enough and creates problem cause
// ! the function is getting old data even though new data is set by `useState` before the execution of function
let lastClientX: number;

export const ResizableMediaNodeView = ({
  node,
  updateAttributes,
  deleteNode, }: NodeViewProps) => {
  const [mediaType, setMediaType] = useState<"img" | "video">();
  const [isHorizontalResizeActive, setIsHorizontalResizeActive] = useState(false);
  const [proseMirrorContainerWidth, setProseMirrorContainerWidth] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(0);

  useEffect(() => {
    setMediaType(node.attrs["media-type"]);
  }, [node.attrs])

  useEffect(() => {
    mediaSetupOnLoad();
  })

  const resizableImgRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null)

  const mediaSetupOnLoad = () => {
    const proseMirrorContainerDiv = document.querySelector(".ProseMirror");

    if (proseMirrorContainerDiv)
      setProseMirrorContainerWidth(proseMirrorContainerDiv?.clientWidth);

    // When the media has loaded
    if (!resizableImgRef.current) return;

    if (mediaType === "video") {
      const video = resizableImgRef.current as HTMLVideoElement;
      video.addEventListener("loadeddata", function () {
        // Aspect Ratio from its original size
        setAspectRatio(video.videoWidth / video.videoHeight);

        // for the first time when video is added with custom width and height
        // and we have to adjust the video height according to it's width
        onHorizontalResize("left", 0);
      });
    } else {
      resizableImgRef.current.onload = () => {
        // Aspect Ratio from its original size
        setAspectRatio(
          (resizableImgRef.current as HTMLImageElement).naturalWidth /
          (resizableImgRef.current as HTMLImageElement).naturalHeight
        );
      }
    }
  }

  const onHorizontalResize = (
    directionOfMouseMove: "right" | "left",
    diff: number) => {
    if (!resizableImgRef.current) {
      return;
    }
    const currentMediaDimensions = {
      width: resizableImgRef.current?.width,
      height: resizableImgRef.current?.height,
    }

    const newMediaDimensions = {
      width: -1,
      height: -1,
    }


    if (directionOfMouseMove == "left") {
      newMediaDimensions.width = currentMediaDimensions.width - diff
    } else {
      newMediaDimensions.width = currentMediaDimensions.width + diff
    }


    if (newMediaDimensions.width > proseMirrorContainerWidth)
      newMediaDimensions.width = proseMirrorContainerWidth;

    newMediaDimensions.height = newMediaDimensions.width / aspectRatio;

    updateAttributes(newMediaDimensions)
  }

  const onHorizontalMouseMove = (e: MouseEvent) => {
    if (lastClientX === -1) return;
    const { clientX } = e;
    // lastClientX是mouse按下时候的坐标，clientX是当点坐标
    const diff = lastClientX - clientX;

    if (diff === 0) return;

    const directionOfMouseMove: "left" | "right" = diff > 0 ? "left" : "right";

    onHorizontalResize(directionOfMouseMove, Math.abs(diff))
    lastClientX = clientX;
  }



  const documentHorizontalMouseMove = (e: MouseEvent) => {
    //TODO 原作者用了setTimeout？
    onHorizontalMouseMove(e);
  };

  const stopHorizontalResize = () => {
    setIsHorizontalResizeActive(false);
    lastClientX = -1;

    document.removeEventListener("mousemove", documentHorizontalMouseMove);
    document.removeEventListener("mouseup", stopHorizontalResize);
  };

  const startHorizontalResize = (e: { clientX: number }) => {
    setIsHorizontalResizeActive(true);
    lastClientX = e.clientX

    //TODO 原作者用了setTimeout？
    document.addEventListener("mousemove", documentHorizontalMouseMove)
    document.addEventListener("mouseup", stopHorizontalResize);
  }
  return <NodeViewWrapper className="w-full flex justify-center not-prose">
    <div className="relative w-fit group  hover:border-blue-400 hover:border-4 hover:rounded-lg">
      {mediaType === "img" && (
        <img
          src={node.attrs.src}
          ref={resizableImgRef as any}
          className="rounded-lg"
          alt={node.attrs.alt}
          width={node.attrs.width}
          height={node.attrs.height}
        />
      )}

      {mediaType === "video" && (
        <video
          ref={resizableImgRef as any}
          className="rounded-lg"
          controls
          width={node.attrs.width}
          height={node.attrs.height}
        >
          <source src={node.attrs.src} />
        </video>
      )}

      <div className="absolute top-[50%] right-1 rounded h-24 w-2.5 z-50 group-hover:bg-black group-hover:border-2 
      group-hover:border-white cursor-col-resize opacity-50 translate-y-[-50%]"  onMouseDown={startHorizontalResize} />
    </div>
  </NodeViewWrapper>
}