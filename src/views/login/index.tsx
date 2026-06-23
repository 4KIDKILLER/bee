import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import {
  BeeIcon,
  Button,
  Field,
  FieldDescription,
  FieldError,
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

const featureItems = [
  {
    icon: <Sparkles className="size-4 text-(--theme-color)" />,
    title: "智能整理",
    description: "快速切换文件视图，持续保持工作台井然有序。",
  },
  {
    icon: <ShieldCheck className="size-4 text-(--theme-color)" />,
    title: "安全访问",
    description: "先完成登录校验，再进入你的文件与存储概览。",
  },
  {
    icon: <LockKeyhole className="size-4 text-(--theme-color)" />,
    title: "会话保持",
    description: "登录状态会在本地保存，刷新页面也能继续访问。",
  },
];

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formState, setFormState] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

      if (errorMessage) {
        setErrorMessage("");
      }
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = formState.username.trim();
    const password = formState.password.trim();

    if (!username || !password) {
      setErrorMessage("请输入账号和密码后再继续登录");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");
      await login({ username, password });
      setFormState(initialFormState);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "登录失败，请稍后重试",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-6 py-10">
      <div className="relative mx-auto flex w-full max-w-[1160px] overflow-hidden rounded-[32px] border border-white/20 bg-black/20 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(64,158,255,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />

        <div className="relative grid w-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex min-h-[680px] flex-col justify-between border-b border-white/10 px-8 py-8 lg:border-r lg:border-b-0 lg:px-10 lg:py-10">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/30 py-2 pl-2 pr-4 backdrop-blur-md">
                <span className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-black/45 shadow-[0_0_30px_rgba(64,158,255,0.18)]">
                  <BeeIcon size={22} name="folder-fill" />
                </span>
                <div>
                  <div className="text-sm font-medium tracking-[0.3em] text-white/85">
                    BEE WORKSPACE
                  </div>
                  <div className="text-xs text-white/45">
                    安全访问你的文件与存储工作台
                  </div>
                </div>
              </div>

              <div className="mt-10 max-w-[420px]">
                <p className="text-sm font-medium uppercase tracking-[0.35em] text-(--theme-color)">
                  Welcome back
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                  登录 BEE，继续你的桌面整理与存储管理
                </h1>
                <p className="mt-5 text-sm leading-7 text-white/55">
                  当前项目已启用基于 JWT 令牌的登录态鉴权。完成登录后，接口返回的令牌会写入本地存储，并在刷新后继续维持访问状态。
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {featureItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur-md"
                >
                  <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                    {item.icon}
                  </div>
                  <div className="mt-4 text-sm font-medium text-white/88">
                    {item.title}
                  </div>
                  <p className="mt-2 text-xs leading-6 text-white/45">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex min-h-[680px] items-center justify-center px-6 py-8 lg:px-10 lg:py-10">
            <div className="w-full max-w-[440px] rounded-[28px] border border-white/12 bg-black/35 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                  <LockKeyhole className="size-5 text-(--theme-color)" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">登录工作台</h2>
                  <p className="mt-1 text-sm text-white/45">
                    请输入账号信息以继续访问 BEE
                  </p>
                </div>
              </div>

              <form className="mt-8" onSubmit={handleSubmit}>
                <FieldGroup className="gap-5">
                  <Field data-invalid={!!errorMessage}>
                    <FieldLabel className="border-none p-0 text-white/78" htmlFor="username">
                      账号
                    </FieldLabel>
                    <Input
                      id="username"
                      name="username"
                      value={formState.username}
                      onChange={handleChange("username")}
                      placeholder="请输入账号"
                      autoComplete="username"
                      className="h-11 rounded-2xl border-white/10 bg-white/6 px-4 text-white placeholder:text-white/28 focus-visible:border-(--theme-color) focus-visible:ring-(--theme-color)/20"
                    />
                  </Field>

                  <Field data-invalid={!!errorMessage}>
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
                      autoComplete="current-password"
                      className="h-11 rounded-2xl border-white/10 bg-white/6 px-4 text-white placeholder:text-white/28 focus-visible:border-(--theme-color) focus-visible:ring-(--theme-color)/20"
                    />
                    <FieldDescription className="text-white/40">
                      当前为本地 JWT 登录态演示，输入任意非空账号和密码后会模拟写入一个 JWT 令牌。
                    </FieldDescription>
                    <FieldError className="text-[#ff8b8b]">{errorMessage}</FieldError>
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
