import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BeeIcon,
  Button,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
} from "/@c/index";
import { useAuth } from "../../permissions/auth-context";

interface LoginFormState {
  username: string;
  password: string;
}

const initialFormState: LoginFormState = {
  username: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formState, setFormState] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const usernameInvalid = hasSubmitted && !formState.username.trim();
  const passwordInvalid = hasSubmitted && !formState.password.trim();

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } } | null;
    return state?.from?.pathname ?? "/home";
  }, [location.state]);

  const handleChange =
    (field: keyof LoginFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: nextValue,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = formState.username.trim();
    const password = formState.password.trim();

    setHasSubmitted(true);

    if (!username || !password) {
      return;
    }

    try {
      setSubmitting(true);
      await login({ username, password });
      setFormState(initialFormState);
      setHasSubmitted(false);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setHasSubmitted(false);
      toast.error(
        error instanceof Error ? error.message : "登录失败，请稍后重试",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-6 py-10">
      <div className="relative mx-auto flex w-full max-w-100 overflow-hidden rounded-[32px] border border-white/20 bg-black/20 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(64,158,255,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />

        <div className="relative w-full">
          <section className="flex min-h-100 items-center justify-center py-8 px-2">
            <div className="w-full max-w-110 rounded-[28px] lg:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                  <BeeIcon size={40} name="logo" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">欢迎回来</h2>
                  <p className="mt-1 text-sm text-white/45">
                    请输入账号信息以继续访问 BEE
                  </p>
                </div>
              </div>

              <form className="mt-8" onSubmit={handleSubmit} autoComplete="off">
                <FieldGroup className="gap-5">
                  <Field data-invalid={usernameInvalid}>
                    <FieldLabel className="border-none p-0 text-white/78" htmlFor="username">
                      账号
                    </FieldLabel>
                    <Input
                      id="username"
                      name="username"
                      value={formState.username}
                      onChange={handleChange("username")}
                      placeholder="请输入账号"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      aria-invalid={usernameInvalid}
                      className="h-11 rounded-2xl border-white/10 bg-white/6 px-4 text-white placeholder:text-white/28 focus-visible:border-(--theme-color) focus-visible:ring-(--theme-color)/20"
                    />
                  </Field>

                  <Field data-invalid={passwordInvalid}>
                    <FieldLabel className="border-none p-0 text-white/78" htmlFor="password">
                      密码
                    </FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formState.password}
                      onChange={handleChange("password")}
                      placeholder="请输入密码"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      aria-invalid={passwordInvalid}
                      className="h-11 rounded-2xl border-white/10 bg-white/6 px-4 text-white placeholder:text-white/28 focus-visible:border-(--theme-color) focus-visible:ring-(--theme-color)/20"
                    />
                  </Field>
                </FieldGroup>

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="mt-8 h-12 w-full rounded-2xl border border-(--theme-color)/40 bg-(--theme-color) text-white shadow-[0_12px_30px_rgba(64,158,255,0.28)] hover:bg-(--theme-color)/90"
                >
                  {submitting ? "正在登录..." : "登录并进入工作台"}
                </Button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Login;
