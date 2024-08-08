import { Layout } from './layout/Layout';

type Props = {
  children: React.ReactNode;
};

export const Root = ({ children }: Props) => {
  return <Layout>{children}</Layout>;
};
