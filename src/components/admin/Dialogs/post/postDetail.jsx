import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";

import { Image as ImageIcon, Tag, FileText } from "lucide-react";
import { Separator } from "../../../ui/separator";
import { cn } from "../../../../lib/utils";

export function PostDetail({ isOpen, handleClose, post }) {
  // Map the post data to local variables to handle both old and new structures
  const displayImage = post?.featured_image || post?.image;
  const displayContent = post?.content || post?.description;
  const displayTags = post?.tags || post?.features || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto rounded-xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Post Details
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Full overview of the published news content
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4">
          {/* Featured Image */}
          <div className="w-full h-[300px] rounded-xl overflow-hidden border bg-gray-50 flex items-center justify-center">
            {displayImage ? (
              <img
                src={displayImage}
                alt="Featured"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <ImageIcon className="h-12 w-12 mb-2 stroke-[1.5]" />
                <span className="text-sm font-medium">No image available</span>
              </div>
            )}
          </div>

          {/* Title & Category Badge */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {post?.title || "Untitled Post"}
            </h2>
            
            {post?.isTip && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-800">
                Tip Selection
              </div>
            )}
          </div>

          <Separator className="bg-gray-100" />

          {/* Content Body */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              Content
            </div>
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
              {displayContent || "No content provided for this post."}
            </p>
          </div>

          <Separator className="bg-gray-100" />

          {/* Tags / Categories */}
          <div className="space-y-3">
            <p className="font-bold text-sm text-gray-900 uppercase tracking-wider">
              Assigned Categories
            </p>
            {displayTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displayTags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-full shadow-sm"
                  >
                    <Tag className="h-3 w-3 mr-1.5" />
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">
                No categories assigned to this post.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="p-6 pt-0">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200 font-semibold hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Close Detail
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}