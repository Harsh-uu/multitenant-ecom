import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div>
      <Button variant="elevated">hehe</Button>
      <Input placeholder="This is an input box" />
      <Progress value={50}/>
      <Textarea>Heello this is textarea</Textarea>
    </div>
  );
}
