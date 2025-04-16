
import { createRoot } from 'react-dom/client';
import AuthContextWrapper from './contexts/AuthContextWrapper';
import './index.css';

createRoot(document.getElementById("root")!).render(<AuthContextWrapper />);
