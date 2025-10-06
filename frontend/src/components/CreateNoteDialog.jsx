import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function CreateNoteDialog({ isOpen, onClose, onSave, loading }) {
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });
  const saveInProgressRef = useRef(false);

  const handleSave = () => {
    if (saveInProgressRef.current || loading) {
      console.log(" Save already in progress, ignoring duplicate call");
      return;
    }

    saveInProgressRef.current = true;
    onSave(newNote);
    setNewNote({ title: "", content: "" });

    setTimeout(() => {
      saveInProgressRef.current = false;
    }, 1000);
  };

  const handleClose = () => {
    setNewNote({ title: "", content: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl ">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Add a new note to your collection
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto pr-2">
          <div>
            <Label htmlFor="title" className="mb-2">
              Title
            </Label>
            <Input
              id="title"
              value={newNote.title}
              onChange={(e) =>
                setNewNote((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter note title..."
            />
          </div>
          <div>
            <Label htmlFor="content" className="mb-2">
              Content
            </Label>
            <Textarea
              id="content"
              value={newNote.content}
              onChange={(e) =>
                setNewNote((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              placeholder="Write your note content..."
              className="h-[400px] resize-none overflow-y-auto"
            />
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading || saveInProgressRef.current}
          className="w-full text-white mt-4"
        >
          {loading ? "Creating..." : "Create Note"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
