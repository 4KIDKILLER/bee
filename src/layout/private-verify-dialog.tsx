import {
  forwardRef,
  useState,
  useImperativeHandle,
  type ChangeEvent,
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
  Field,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupInput,
} from "/@c/index";

type VerifyDataType = { password: string };

interface PrivateVerifyDialogRef {
  resetFields: () => void;
}

interface PrivateVerifyDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VerifyDataType) => void;
}

const PrivateVerifyDialog = forwardRef<
  PrivateVerifyDialogRef,
  PrivateVerifyDialogProps
>(({ open, onClose, onSubmit }, ref) => {
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState("");

  useImperativeHandle(ref, () => ({
    resetFields: () => setPassword(""),
  }));

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password == "") {
      setInvalid(true);
    } else {
      onSubmit({ password });
    }
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setPassword(nextValue);
    if (nextValue == "") setInvalid(true);
  };

  const handleCancel = () => {
    onClose();
    setPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>二级验证</DialogTitle>
            <DialogDescription>输入秘钥以验证您的身份</DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-4">
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor="imageName">
                秘钥
                <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  required
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  aria-invalid={invalid}
                  placeholder="请输入秘钥"
                  onChange={onPasswordChange}
                />
              </InputGroup>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button onClick={handleCancel} variant="outline">
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

export default PrivateVerifyDialog;

export type { VerifyDataType, PrivateVerifyDialogRef };
