import React from 'react';
import * as Yup from 'yup';
import { withFormik, FormikProps, FormikErrors, Form, Field } from 'formik';

// フォームの値の型
interface FormValues {
  email: string;
  password: string;
}

interface OtherProps {
  message: string;
}

// 余談: 昔のコードで以下のコードではない、InjectedFormikProps<OtherProps, FormValues> というものを見るかもしれません。
// InjectedFormikProps は Fromik が HoC をエクスポートした　時のみの資材です。
// これは全ての props をラップしなくてはいけないので、柔軟性に欠けます。。
const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
  const { touched, errors, isSubmitting, message } = props;
  return (
    <Form>
      <h1>{message}</h1>
      <Field type="email" name="email" />
      {touched.email && errors.email && <div>{errors.email}</div>}

      <Field type="password" name="password" />
      {touched.password && errors.password && <div>{errors.password}</div>}

      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </Form>
  );
};

// MyForm が受け取る props の型
interface MyFormProps {
  initialEmail?: string;
  message: string; // もしこれが全ての方法を通過したなら、これを実行するかユニオンタイプを作ってもいいでしょう
}

// withFormik HoC を使ってフォームをラップする
const MyForm = withFormik<MyFormProps, FormValues>({
  // 外部の props をフォームの値に変換する
  mapPropsToValues: props => {
    return {
      email: props.initialEmail || '',
      password: '',
    };
  },

  // カスタムバリデーション関数を追加する（ここも非同期）
  validate: (values: FormValues) => {
    let errors: FormikErrors<FormValues> = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    return errors;
  },

  handleSubmit: values => {
    // サブミットする何かを実行する
  },
})(InnerForm);

// Use <MyForm /> wherevs
const Basic = () => (
  <div>
    <h1>My App</h1>
    <p>This can be anywhere in your application</p>
    <MyForm message="Sign up" />
  </div>
);

export default Basic;
