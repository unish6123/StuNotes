import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Play } from "lucide-react";

export default function ViewDialog({
  isOpen,
  onClose,
  item,
  onEdit,
  onTakeQuiz,
  itemType = "note", // "note" or "transcript"
  titleProperty = "title",
  contentProperty = "content",
  dateProperty = "date",
  typeProperty = "type",
}) {
  if (!item) return null;

  const getDisplayDate = () => {
    const dateValue = item[dateProperty];
    if (!dateValue) return "Unknown date";

    // If it's already a formatted date string (like from notes), use it directly
    if (
      typeof dateValue === "string" &&
      dateValue.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      return dateValue;
    }

    try {
      // Handle both string timestamps and Date objects
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString();
    } catch (error) {
      return "Date error";
    }
  };

  const getBadgeText = () => {
    if (itemType === "transcript") {
      return "Transcribed";
    }
    return item[typeProperty] === "transcribed" ? "Transcribed" : "Manual";
  };

  const getBadgeVariant = () => {
    if (itemType === "transcript") {
      return "secondary";
    }
    return item[typeProperty] === "transcribed" ? "default" : "secondary";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={
          itemType === "note"
            ? "min-w-[70vw] max-w-none max-h-[90vh]"
            : "min-w-[70vw] max-w-4xl max-h-[80vh]"
        }
      >
        <DialogHeader>
          {itemType === "note" ? (
            <>
              <DialogTitle className="text-2xl flex items-start">
                {item[titleProperty]}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4" />
                {getDisplayDate()}
                <Badge variant={getBadgeVariant()} className="ml-2">
                  {getBadgeText()}
                </Badge>
              </DialogDescription>
            </>
          ) : (
            <div>
              <div>
                <DialogTitle className="text-xl mb-2 text-left">
                  {item[titleProperty]}
                </DialogTitle>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {getDisplayDate()}
                  </div>
                  <Badge variant={getBadgeVariant()} className="text-xs">
                    {getBadgeText()}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogHeader>

        <div
          className={
            itemType === "note"
              ? "overflow-y-auto max-h-[70vh] pr-4"
              : "overflow-y-auto max-h-[50vh] pr-2"
          }
        >
          <div
            className={
              itemType === "note"
                ? "prose prose-sm max-w-none dark:prose-invert"
                : ""
            }
          >
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {item[contentProperty]}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={() => onEdit(item)}
            variant={itemType === "note" ? "outline" : "secondary"}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            {itemType === "note" ? "Edit Note" : "Edit"}
          </Button>
          <Button
            onClick={() => onTakeQuiz(item)}
            className="flex-1 bg-primary hover:bg-green-600 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Take Quiz
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
