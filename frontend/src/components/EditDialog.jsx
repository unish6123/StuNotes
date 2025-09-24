import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function EditDialog({
  isOpen,
  onClose,
  item,
  onSave,
  loading,
  itemType = "note", // "note" or "transcript"
  titleProperty = "title",
  contentProperty = "content",
  idProperty = "id",
}) {
  const [editingItem, setEditingItem] = useState({
    title: "",
    content: "",
    id: "",
  });

  useEffect(() => {
    if (item) {
      setEditingItem({
        title: item[titleProperty] || "",
        content: item[contentProperty] || "",
        id: item[idProperty] || item._id || "",
      });
    }
  }, [item, titleProperty, contentProperty, idProperty]);

  const handleSave = () => {
    if (itemType === "note") {
      // For notes, pass the updated item directly
      onSave(
        { ...item, title: editingItem.title, content: editingItem.content },
        true
      );
    } else {
      // For transcripts, pass the editing item
      onSave(editingItem, true);
    }
  };

  const handleClose = () => {
    setEditingItem({ title: "", content: "", id: "" });
    onClose();
  };

  const handleFieldChange = (field, value) => {
    if (itemType === "note") {
      // For notes, update the item directly through onSave
      onSave({ ...item, [field]: value });
    } else {
      // For transcripts, update local state
      setEditingItem((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getCurrentValue = (field) => {
    if (itemType === "note") {
      return item?.[field] || "";
    }
    return editingItem[field] || "";
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Edit {itemType === "note" ? "Note" : "Transcript"}
          </DialogTitle>
          <DialogDescription>Make changes to your {itemType}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto  pr-2">
          <div>
            <Label htmlFor="edit-title" className="mb-2">
              Title
            </Label>
            <Input
              id="edit-title"
              value={getCurrentValue("title")}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder={`Enter ${itemType} title...`}
            />
          </div>
          <div>
            <Label htmlFor="edit-content" className="mb-2">
              Content
            </Label>
            <Textarea
              id="edit-content"
              value={getCurrentValue("content")}
              onChange={(e) => handleFieldChange("content", e.target.value)}
              placeholder={
                itemType === "note"
                  ? "Write your note content..."
                  : "Edit your transcript content..."
              }
              className="h-[400px] resize-none overflow-y-auto"
            />
          </div>
        </div>

        <div className={itemType === "note" ? "flex gap-2 mt-4" : "mt-4"}>
          {itemType === "note" ? (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 text-white"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full text-white"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
