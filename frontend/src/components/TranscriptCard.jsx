import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Play, MoreVertical, Eye, Edit, FileText } from "lucide-react";
import DeleteDialog from "./DeleteDialog";

export default function TranscriptCard({
  transcript,
  onView,
  onEdit,
  onTakeQuiz,
  onDelete,
  deleteLoading,
  quizLoading,
  onGenerateQuiz,
}) {
  return (
    <Card
      className="h-[200px] bg-card border-border hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView(transcript)}
    >
      <CardContent className="p-3 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <FileText className="text-primary mr-1" />
          <h3 className="font-bold text-base line-clamp-1 flex-1 mr-2">
            {transcript.title}
          </h3>
          <div
            className="flex items-center gap-1 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              {new Date(transcript.createdAt).toLocaleDateString()}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(transcript)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(transcript)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTakeQuiz(transcript)}>
                  <Play className="h-4 w-4 mr-2" />
                  Take Quiz
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 mt-3 mb-3">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {transcript.content}
          </p>
        </div>

        <div
          className="flex gap-2 mt-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent text-xs sm:text-sm"
            onClick={() => onView(transcript)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Open
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-green-600 text-white text-xs sm:text-sm"
            onClick={() => onGenerateQuiz(transcript.title)}
            disabled={quizLoading === transcript.title}
          >
            <Play className="h-3 w-3 mr-1" />
            {quizLoading === transcript.title ? "Generating..." : "Take Quiz"}
          </Button>
          <DeleteDialog
            item={transcript}
            onDelete={onDelete}
            loading={deleteLoading === transcript._id}
            itemType="Transcript"
            titleProperty="title"
            idProperty="_id"
          />
        </div>
      </CardContent>
    </Card>
  );
}
