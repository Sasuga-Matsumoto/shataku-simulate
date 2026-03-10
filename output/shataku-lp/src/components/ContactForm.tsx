'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getUtmParams, submitToGAS } from '@/src/lib/gas';

interface FormErrors {
  company?: string;
  lastName?: string;
  firstName?: string;
  email?: string;
  phone?: string;
  employees?: string;
  department?: string;
  inquiry?: string;
  referralSource?: string;
}

function FadeIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-in${visible ? ' visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

export default function ContactForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function validate(): boolean {
    const form = formRef.current;
    if (!form) return false;
    const newErrors: FormErrors = {};
    let valid = true;

    const company = (form.elements.namedItem('company') as HTMLInputElement).value.trim();
    if (!company) {
      newErrors.company = '会社名を入力してください';
      valid = false;
    }

    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value.trim();
    if (!lastName) {
      newErrors.lastName = '姓を入力してください';
      valid = false;
    }

    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value.trim();
    if (!firstName) {
      newErrors.firstName = '名を入力してください';
      valid = false;
    }

    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    if (!email) {
      newErrors.email = 'メールアドレスを入力してください';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
      valid = false;
    }

    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
    if (!phone) {
      newErrors.phone = '電話番号を入力してください';
      valid = false;
    } else if (!/^[\d\-+() ]{8,}$/.test(phone)) {
      newErrors.phone = '正しい電話番号を入力してください';
      valid = false;
    }

    const employees = (form.elements.namedItem('employees') as HTMLSelectElement).value;
    if (!employees) {
      newErrors.employees = '従業員数を選択してください';
      valid = false;
    }

    const department = (form.elements.namedItem('department') as HTMLInputElement).value.trim();
    if (!department) {
      newErrors.department = '部署名を入力してください';
      valid = false;
    }

    const inquiry = (form.elements.namedItem('inquiry') as HTMLTextAreaElement).value.trim();
    if (!inquiry) {
      newErrors.inquiry = 'お問い合わせ内容を入力してください';
      valid = false;
    }

    const referralSource = (form.elements.namedItem('referralSource') as HTMLSelectElement).value;
    if (!referralSource) {
      newErrors.referralSource = '流入経路を選択してください';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const form = formRef.current!;
    setSubmitting(true);

    const utm = getUtmParams();
    const data: Record<string, string> = {
      company: (form.elements.namedItem('company') as HTMLInputElement).value.trim(),
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value.trim(),
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value.trim(),
      employees: (form.elements.namedItem('employees') as HTMLSelectElement).value || '',
      department: (form.elements.namedItem('department') as HTMLInputElement).value.trim() || '',
      position: (form.elements.namedItem('position') as HTMLInputElement).value.trim() || '',
      inquiry: (form.elements.namedItem('inquiry') as HTMLTextAreaElement).value.trim(),
      referralSource: (form.elements.namedItem('referralSource') as HTMLSelectElement).value || '',
      formType: 'お問い合わせ',
      ...utm,
    };

    try {
      await submitToGAS(data);
      router.push('/thanks-contact/');
    } catch {
      setSubmitting(false);
      alert('送信に失敗しました。時間をおいて再度お試しください。');
    }
  }

  return (
    <>
      {/* ===== Page Hero ===== */}
      <section className="page-hero">
        <div className="inner">
          <div className="page-hero-label">CONTACT</div>
          <h1>お問い合わせ</h1>
        </div>
      </section>

      {/* ===== Contact Section ===== */}
      <section className="contact-section">
        <div className="contact-inner">
          <FadeIn>
            <div className="form-card">
              <div className="form-card-title">以下のフォームにご記入ください</div>
              <form ref={formRef} onSubmit={handleSubmit} noValidate>

                {/* 会社名 */}
                <div className="input-group">
                  <label htmlFor="company">会社名<span className="required">必須</span></label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="例: 株式会社プレックス"
                    className={errors.company ? 'input-error' : ''}
                    required
                  />
                  <div className="inline-error">{errors.company || ''}</div>
                </div>

                {/* 氏名 */}
                <div className="input-group">
                  <label>氏名<span className="required">必須</span></label>
                  <div className="input-row">
                    <div>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="姓"
                        className={errors.lastName ? 'input-error' : ''}
                        required
                      />
                      <div className="inline-error">{errors.lastName || ''}</div>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="名"
                        className={errors.firstName ? 'input-error' : ''}
                        required
                      />
                      <div className="inline-error">{errors.firstName || ''}</div>
                    </div>
                  </div>
                </div>

                {/* メールアドレス */}
                <div className="input-group">
                  <label htmlFor="email">メールアドレス<span className="required">必須</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="例: info@example.com"
                    className={errors.email ? 'input-error' : ''}
                    required
                  />
                  <div className="inline-error">{errors.email || ''}</div>
                </div>

                {/* 電話番号 */}
                <div className="input-group">
                  <label htmlFor="phone">電話番号<span className="required">必須</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="例: 03-1234-5678"
                    className={errors.phone ? 'input-error' : ''}
                    required
                  />
                  <div className="inline-error">{errors.phone || ''}</div>
                </div>

                {/* 従業員数 */}
                <div className="input-group">
                  <label htmlFor="employees">従業員数<span className="required">必須</span></label>
                  <select
                    id="employees"
                    name="employees"
                    className={errors.employees ? 'input-error' : ''}
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="1-10">1〜10名</option>
                    <option value="11-30">11〜30名</option>
                    <option value="31-50">31〜50名</option>
                    <option value="51-100">51〜100名</option>
                    <option value="101-300">101〜300名</option>
                    <option value="301+">301名以上</option>
                  </select>
                  <div className="inline-error">{errors.employees || ''}</div>
                </div>

                {/* 部署名 */}
                <div className="input-group">
                  <label htmlFor="department">部署名<span className="required">必須</span></label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    placeholder="例: 人事部"
                    className={errors.department ? 'input-error' : ''}
                    required
                  />
                  <div className="inline-error">{errors.department || ''}</div>
                </div>

                {/* 役職 */}
                <div className="input-group">
                  <label htmlFor="position">役職</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    placeholder="例: 部長"
                  />
                </div>

                {/* お問い合わせ内容 */}
                <div className="input-group">
                  <label htmlFor="inquiry">お問い合わせ内容<span className="required">必須</span></label>
                  <textarea
                    id="inquiry"
                    name="inquiry"
                    placeholder="ご質問・ご相談内容をご記入ください"
                    className={errors.inquiry ? 'input-error' : ''}
                    required
                  />
                  <div className="inline-error">{errors.inquiry || ''}</div>
                </div>

                {/* 流入経路 */}
                <div className="input-group">
                  <label htmlFor="referralSource">PLEX福利厚生をどこで知りましたか？<span className="required">必須</span></label>
                  <select
                    id="referralSource"
                    name="referralSource"
                    className={errors.referralSource ? 'input-error' : ''}
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="Facebook/Instagram">Facebook/Instagram</option>
                    <option value="WEB検索">WEB検索</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X（旧Twitter）">X（旧Twitter）</option>
                    <option value="展示会">展示会</option>
                    <option value="イベント">イベント</option>
                    <option value="知人/取引先からの紹介">知人/取引先からの紹介</option>
                    <option value="その他">その他</option>
                  </select>
                  <div className="inline-error">{errors.referralSource || ''}</div>
                </div>

                {/* プライバシーポリシー同意文言 */}
                <p className="privacy-consent">
                  以下のボタンを押すと、<a href="/privacy/" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>に同意したものとみなされます。
                </p>

                {/* 送信ボタン */}
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? '送信中...' : '送信する'}
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
