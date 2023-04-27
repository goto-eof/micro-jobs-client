import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customInterceptor } from '../interceptors/LoginInterceptor';
interface NavigateFunctionComponentProps {}
export default function InterceptorInit({}: NavigateFunctionComponentProps) {
  let navigate = useNavigate();
  const [ran, setRan] = useState(false);

  if (!ran) {
    customInterceptor(navigate);
    setRan(true);
  }
  return <></>;
}
