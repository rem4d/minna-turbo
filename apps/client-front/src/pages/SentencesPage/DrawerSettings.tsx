import Drawer from "@/components/Drawer";
import { List, ListItem } from "@/components/List";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export default function DrawerSettings({ open, onOpenChange }: Props) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <div className="bg-super-silver relative flex size-full flex-col space-y-2">
        <div className="relative bottom-0 mb-[200px] w-full max-w-[450px] self-center">
          <List title="Последний выученный кандзи">
            <ListItem title="S" sub="98 уровень" />
          </List>
        </div>
      </div>
    </Drawer>
  );
}
