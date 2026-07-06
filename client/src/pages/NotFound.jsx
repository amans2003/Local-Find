import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 Not Found — LocalFind</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-8xl font-bold text-primary-light">404</p>
          <h1 className="text-h1 mt-4">Page not found</h1>
          <p className="text-text-muted mt-2 mb-8">The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    </>
  );
}
