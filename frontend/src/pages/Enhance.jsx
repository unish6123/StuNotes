import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
MoveLeft,
WandSparkles
} from "lucide-react";


import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

{/*Example audio transcription items*/}
const transcriptions2 = [
  { id: 1, title: 'Intro To Biology Lecture 1', date: "2024-01-15", duration: "45:30", content: "Today we the major organs systems in the body.." },
  { id: 2, title: 'Software Engineering Capstone Lecture 5', date: "2024-01-14", duration: "38:15", content: "Your application will be built with React JS..." },
  { id: 3, title: 'Front-End Web Development Presentation 15', date: "2024-01-13", duration: "50:00", content: "A source property is required for the image tag..." },
  { id: 4, title: 'Design of Algorithims Lecture 3', date: "2024-01-12", duration: "42:20", content: "Today's seminar focused on Dijkstra's algorithm ..." },  
];

{/*Example ehnanced content, change later so it stores cotent retrived fqrom Gemini API call */}
const EnhancedContent = "Example Enhanced Context";


{/*Header that stays the whole time */}
function Header() {
  return (
     <div className="container mx-auto px-4 py-8 ">
       <h1 className="text-3xl font-bold mb-2">Enhance Notes</h1>
       <p className="text-muted-foreground">
         Select one of your saved audio transcriptions or paste in your own set of notes for enhancement.
       </p>
       <br></br>
       <hr className="bg-green-500"></hr>
   </div>
  );
}


{/*Paste Notes Component */}
function PasteComponent() {

{/*Button text for the dropdown menu button */}
const [buttonText, setButtonText]= useState("Select Saved Transcriptions");

{/*Place Holder and text area content for the leftmost text area */}
const [placeholderText, setPlaceHolderText] = useState("Or paste Notes here...");
const [textAreaContent, setTextAreaContent] = useState(null);

{/*Place Holder and text area content for the rightmost text area */}
const [placeholderText2, setPlaceHolderText2] = useState("..and StuNotes Enhanced Notes will appear here!");
const [textAreaContent2, setTextAreaContent2] = useState(null);

{/*State to control if the second text area is editable or not */}
const [isEditable, setIsEditable] = useState(false);

return (
  <div className="w-full flex flex-col gap-4">
    <div className="w-full flex justify-start">
      {/* Button that spans a dropdown menu to select transcription to use for enhancement */}
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <Button size="lg" className="gap-2 text-white cursor-pointer">
            {buttonText}
          </Button>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Content sideOffset={40} side="right" className="bg-grey rounded shadow-lg p-2 min-w-[150px] border">
          {transcriptions2.map((item) => (
            <DropdownMenuPrimitive.Item
              key={item.id}
              className="px-4 py-2 hover:bg-[#04583D] cursor-pointer rounded"
              onSelect={() => {
                setButtonText(item.title);
                setPlaceHolderText(null);
                setTextAreaContent(item.content);
  
              }}
            >
              {item.title}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Root>
    </div>
    <div className="w-full flex gap-4">
      <Textarea
        className="w-1/2 text-white"
        placeholder={placeholderText}
        value={textAreaContent}
        onChange={(e) => setTextAreaContent(e.target.value)}
      />
      <Textarea
        className="w-1/2"
        placeholder={placeholderText2}
        value={textAreaContent2}
        readOnly={!isEditable}
        onChange={isEditable ? (e) => setTextAreaContent2(e.target.value) : undefined}
      />
    </div>
    <div className="w-full flex justify-end">
      <Button
        size="lg"
        className="gap-2 text-white cursor-pointer m-3"
        onClick={() => {
          setTextAreaContent2(EnhancedContent);
          setIsEditable(true);
          console.log("Second textarea is now editable");
          console.log(generateAIResponse("Data = raw information you can draw insight from. Data visualization = graphical representation of data and info using charts, graphs, maps etc.Analytics = process of transforming data into insights. Quantitative data = Data for which numerical values indicate magnitude. Arithmetic operations can be applied on them.",false));
        }}
      >
        <WandSparkles className="h-5 w-5" />
        Enhance
      </Button>
    </div>
  </div>
);
}



export default function Enhance() {

return (
    <div className="container mx-auto px-4 py-8 max-w-8xl ">
        {/* This is always visible */}
        <Header />

        <div className="">
            
            <div className="p-4 flex-1">
                <PasteComponent></PasteComponent>
            </div>
        </div>
    </div>
);


}



{/*For Pavels reference, ignore, ill delete later when im down with it */}
{/*Notes source selection (original) 
function FirstComponent({ switchToSecond }) {
  return (
   <div className="text-center">
      <Card className="m-4 inline-block">
        <CardHeader>
          <CardTitle>Choose Notes Source</CardTitle>
        </CardHeader>


        <CardContent>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2" onClick={switchToSecond}>
              Paste Notes
          </button>

          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2" onClick={() => switchToSecond}>
              Select Saved Transcription
          </button>
        </CardContent>
      </Card>
  </div>
*/}


{/*Example Dropdown Menu
        <div className="mt-4 flex justify-end">
            <DropdownMenuPrimitive.Root>
                <DropdownMenuPrimitive.Trigger asChild>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Menu
                    </button>
                </DropdownMenuPrimitive.Trigger>
                <DropdownMenuPrimitive.Content
                    sideOffset={5}
                    className="bg-grey rounded shadow-lg p-2 min-w-[150px] border"
                >
                    <DropdownMenuPrimitive.Item className="px-4 py-2 hover:bg-green-100 cursor-pointer rounded">
                        Item 1
                    </DropdownMenuPrimitive.Item>
                    <DropdownMenuPrimitive.Item className="px-4 py-2 hover:bg-green-100 cursor-pointer rounded">
                        Item 2
                    </DropdownMenuPrimitive.Item>
                    <DropdownMenuPrimitive.Item className="px-4 py-2 hover:bg-green-100 cursor-pointer rounded">
                        Item 3
                    </DropdownMenuPrimitive.Item>
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Root>
        </div>
        */}


        