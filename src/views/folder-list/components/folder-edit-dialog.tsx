import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SubmitEvent,
} from "react";
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
  FieldGroup,
  FieldLabel,
  Input,
} from "/@c/index";

const modeText = {
  1: {
    title: "创建文件夹",
    desc: "在当前文件夹里创建一个专门用来存放图片的新文件夹",
  },
  2: {
    title: "编辑文件夹",
    desc: "修改当前图片文件夹的名称或存储路径以便更好地管理",
  },
};
interface FolderEditFormData {
  folderName: string;
}

interface FolderEditDialogRef {
  setFormData: (data: FolderEditFormData) => void;
  resetForm: () => void;
}

interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  onCancel?: () => void;
  mode: 1 | 2;
  onConfirm?: (folderName: string) => void;
}

const CreateFolderDialog = forwardRef<
  FolderEditDialogRef,
  CreateFolderDialogProps
>(({ open, mode, onClose, children, onCancel, onConfirm }, ref) => {
  const [folderName, setFolderName] = useState("");
  const [invalid, setInvalid] = useState(false);
  // const [open, setOpen] = useState(false);

  const resetForm = () => {
    setFolderName("");
    setInvalid(false);
  };

  useImperativeHandle(ref, () => ({
    setFormData: ({ folderName: nextFolderName }) => {
      setFolderName(nextFolderName);
      setInvalid(false);
    },
    resetForm,
  }));

  const text = useMemo(() => modeText[mode], [mode]);

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

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFolderName(folderName)) {
      setInvalid(true);
      return;
    }

    onConfirm?.(folderName);
  };

  const onFolderNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setFolderName(nextValue);
    if (invalid) {
      setInvalid(!validateFolderName(nextValue));
    }
  };

  const handleOpenChange = (status: boolean) => {
    if (!status) {
      onClose();
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{text.title}</DialogTitle>
            <DialogDescription>{text.desc}</DialogDescription>
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
                maxLength={10}
                name="folderName"
                autoCorrect="off"
                autoComplete="off"
                value={folderName}
                spellCheck={false}
                autoCapitalize="none"
                aria-invalid={invalid}
                placeholder="请输入文件夹名称"
                onChange={onFolderNameChange}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button onClick={onCancel} variant="outline">
                取消
              </Button>
            </DialogClose>
            <Button type="submit">确定</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export type { FolderEditDialogRef, FolderEditFormData };
export default CreateFolderDialog;
