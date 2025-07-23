import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LogOut } from 'lucide-react';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    // Optional: Auto-logout after 3 seconds
    const timer = setTimeout(handleLogout, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Logout</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <LogOut className="h-4 w-4" />
            <AlertTitle>Logging Out</AlertTitle>
            <AlertDescription>
              You will be logged out in a few seconds. Click below to logout immediately.
            </AlertDescription>
          </Alert>
          <Button className="w-full mt-4" onClick={handleLogout}>
            Logout Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Logout;