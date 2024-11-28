import React from 'react'
import ReactPlayer from 'react-player/youtube'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

const VideoSolutionDialog = ({ isOpen, onClose, videoId }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Solution Video</DialogTitle>
        </DialogHeader>
        <div className="relative pt-[56.25%]">
          {videoId ? (
            <ReactPlayer
              url={videoId}
              width="100%"
              height="100%"
              controls
              playing
              className="absolute top-0 left-0"
              onError={(e) => console.error('ReactPlayer error:', e)}
            />
          ) : (
            <p>No video URL available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VideoSolutionDialog

