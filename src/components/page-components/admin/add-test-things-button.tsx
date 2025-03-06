import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AddTestThingsButtons = () => {
  return (
    <div className="w-full flex justify-between gap-2 mt-4">
      <Button size="none" variant={'indigo'} className="w-full p-2">Add subject <Plus/></Button>
      <Button size="none" variant={'indigo'} className="w-full p-2">Add question<Plus/></Button>
      <Button size="none" variant={'indigo'} className="w-full p-2">Add true/false<Plus/></Button>
      <Button size="none" variant={'indigo'} className="w-full p-2">Add multiple<Plus/></Button>
    </div>
  );
};

export default AddTestThingsButtons;
