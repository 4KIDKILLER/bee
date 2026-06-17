import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "/@c/index";

interface CreateFolderDialogProps {
  children: ReactNode;
}

function CreateFolderDialog({ children }: CreateFolderDialogProps) {
  const [fileName, setFileName] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [open, setOpen] = useState(false);

  const validateFolderName = (name: string): boolean => {
    if (!name.trim()) {
      return false;
    }

    if (name.length > 50) {
      return false;
    }

    const illegalChars = /[\\/:*?"<>|]/;
    if (illegalChars.test(name)) {
      return false;
    }

    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFolderName(fileName)) {
      setInvalid(true);
      return;
    }

    console.log("创建文件夹:", fileName.trim());

    setFileName("");
    setInvalid(false);
    setOpen(false);
  };

  const handleFileNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setFileName(nextValue);
    if (invalid) {
      setInvalid(!validateFolderName(nextValue));
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFileName("");
      setInvalid(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>创建文件夹</DialogTitle>
            <DialogDescription>
              在当前文件夹里创建一个专门用来存放图片的新文件夹
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-4">
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor="folderName">
                文件夹名称
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                required
                id="folderName"
                name="folderName"
                value={fileName}
                onChange={handleFileNameChange}
                aria-invalid={invalid}
                placeholder="请输入文件夹名称"
              />
              <FieldError>
                请输入有效的文件夹名称，且不能包含 \\ / : * ? " &lt; &gt; |
              </FieldError>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button type="submit">确定</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateFolderDialog;
