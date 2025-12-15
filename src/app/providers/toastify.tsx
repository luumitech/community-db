import { useTheme } from 'next-themes';
import { ToastContainer } from 'react-toastify';

interface Props {}

export const ToastifyProviders: React.FC<Props> = () => {
  const { resolvedTheme } = useTheme();

  return <ToastContainer position="bottom-right" theme={resolvedTheme} />;
};
