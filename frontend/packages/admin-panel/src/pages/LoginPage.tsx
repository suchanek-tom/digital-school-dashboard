import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, LockKeyhole, CircleAlert } from 'lucide-react'

type LoginFormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const onSubmit = (data: LoginFormData) => {
    // TODO: Napojení na autentizační API
    console.log('Formulář je validní', {
      email: data.email,
    })
  }

  return (
    <div className="min-h-screen bg-[#E3F2FD]">
      <header className="bg-[#0D47A1] px-6 py-4 text-white">
        <h1 className="text-2xl font-bold md:text-3xl">
          Digitální nástěnka
        </h1>
      </header>

      <main className="flex min-h-[calc(100vh-68px)] items-center justify-center px-4 py-8">
        <section className="w-full max-w-[460px] rounded-2xl border border-[#90CAF9] bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#90CAF9] bg-[#E3F2FD]">
            <LockKeyhole
              size={30}
              strokeWidth={1.5}
              className="text-[#0D47A1]"
            />
          </div>

          <h2 className="mb-2 text-3xl font-bold text-[#0D47A1] sm:text-4xl">
            Přihlášení
          </h2>

          <p className="mb-7 text-base leading-relaxed text-[#2196F3]">
            Zadejte e-mail a heslo pro přístup k nástěnce.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-2 block text-base font-semibold text-[#0D47A1]"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Zadejte e-mail"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full rounded-lg border-2 px-4 py-3 text-base outline-none transition-colors ${
                  errors.email
                    ? 'border-[#90CAF9] border-b-red-500 bg-white text-[#0D47A1] placeholder:text-[#2196F3] focus:border-b-red-600'
                    : 'border-[#90CAF9] text-[#0D47A1] placeholder:text-[#2196F3] focus:border-[#2196F3] focus:ring-2 focus:ring-[#90CAF9]'
                }`}
                {...register('email', {
                  required: 'Zapomněli jste zadat e-mail',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Zadejte platnou e-mailovou adresu.',
                  },
                })}
              />

              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-2 flex items-center gap-2 text-sm font-medium text-red-600"
                >
                  <CircleAlert size={16} aria-hidden="true" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block text-base font-semibold text-[#0D47A1]"
              >
                Heslo
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Zadejte heslo"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                  className={`w-full rounded-lg border-2 px-4 py-3 pr-14 text-base outline-none transition-colors ${
                    errors.password
                      ? 'border-[#90CAF9] border-b-red-500 bg-white text-[#0D47A1] placeholder:text-[#2196F3] focus:border-b-red-600'
                      : 'border-[#90CAF9] text-[#0D47A1] placeholder:text-[#2196F3] focus:border-[#2196F3] focus:ring-2 focus:ring-[#90CAF9]'
                  }`}
                  {...register('password', {
                    required: 'Zapomněli jste zadat heslo',
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'
                  }
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-[#0D47A1] hover:text-[#2196F3] focus-visible:outline-2 focus-visible:outline-[#2196F3]"
                >
                  {showPassword ? (
                    <Eye size={21} />
                  ) : (
                    <EyeOff size={21} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-2 flex items-center gap-2 text-sm font-medium text-red-600"
                >
                  <CircleAlert size={16} aria-hidden="true" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Zapomenuté heslo – placeholder pro US-03 */}
            <div className="mb-6 text-right">
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="text-sm font-semibold text-[#2196F3] underline underline-offset-4 hover:text-[#0D47A1] sm:text-base"
              >
                Zapomněli jste heslo?
              </a>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg bg-[#2196F3] px-5 py-3 text-lg font-bold text-white transition-colors hover:bg-[#0D47A1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D47A1]"
            >
              Přihlásit se
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}





