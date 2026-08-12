import {
  forwardRef,
  useImperativeHandle,
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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from "/@c/index";

interface ImageEditFormData {
  imageName: string;
}

interface ImageEditDialogRef {
  setFormData: (data: ImageEditFormData) => void;
  resetForm: () => void;
}

interface EditImageDialogProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  onCancel?: () => void;
  onConfirm?: (imageName: string) => void;
}

const CreateFolderDialog = forwardRef<ImageEditDialogRef, EditImageDialogProps>(
  ({ open, onClose, children, onCancel, onConfirm }, ref) => {
    const [imageName, setImageName] = useState("");
    const [invalid, setInvalid] = useState(false);
    const [fileExt, setFileExt] = useState("");

    const resetForm = () => {
      setImageName("");
      setInvalid(false);
    };

    useImperativeHandle(ref, () => ({
      setFormData: ({ imageName: nextImageName }) => {
        const dotIndex = nextImageName.lastIndexOf(".");
        const fileName = nextImageName.slice(0, dotIndex);
        const fileExt = nextImageName.slice(dotIndex);
        setImageName(fileName);
        setFileExt(fileExt);
        setInvalid(false);
      },
      resetForm,
    }));

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

      if (!validateFolderName(imageName)) {
        setInvalid(true);
        return;
      }

      onConfirm?.(`${imageName}${fileExt}`);
    };

    const onImageNameChange = (e: ChangeEvent<HTMLInputElement>) => {
      const nextValue = e.target.value;
      setImageName(nextValue);
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
              <DialogTitle>修改图片名称</DialogTitle>
              <DialogDescription>
                为当前图片重新设置一个自己喜欢的名称吧
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="mt-4">
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor="imageName">
                  图片名称
                  <span className="text-destructive">*</span>
                </FieldLabel>
                {/* <Input
                required
                id="imageName"
                maxLength={10}
                name="imageName"
                value={imageName}
                aria-invalid={invalid}
                placeholder="请输入图片名称"
                onChange={onImageNameChange}
              /> */}
                <InputGroup>
                  <InputGroupInput
                    required
                    id="imageName"
                    maxLength={10}
                    name="imageName"
                    value={imageName}
                    aria-invalid={invalid}
                    placeholder="请输入图片名称"
                    onChange={onImageNameChange}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>{fileExt}</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
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
  },
);

export type { ImageEditDialogRef, ImageEditFormData };
export default CreateFolderDialog;
