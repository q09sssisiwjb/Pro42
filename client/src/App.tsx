import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import TextToImageGenerator from "@/pages/TextToImageGenerator";
import Favorites from "@/pages/Favorites";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from "@/components/UserAvatar";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/text-to-image" component={TextToImageGenerator} />
      <Route path="/favorites" component={Favorites} />
      <Route component={NotFound} />
    </Switch>
  );
}

function TopBar() {
  const { user, loading } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleLogin = () => {
    setAuthMode('login');
    setAuthDialogOpen(true);
  };

  const handleSignup = () => {
    setAuthMode('signup');
    setAuthDialogOpen(true);
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
          <div className="hidden md:flex items-center space-x-6">
            <a href="#tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-tools">
              Tools
            </a>
            <a href="#guides" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-guides">
              Guides
            </a>
            <a href="#gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-gallery">
              Gallery
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!loading && (
            user ? (
              <UserAvatar user={user} className="h-8 w-8" />
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleLogin}>
                  Login
                </Button>
                <Button size="sm" className="bg-[#8a3dff] hover:bg-[#7c36e6] text-white" onClick={handleSignup}>
                  Sign Up
                </Button>
              </>
            )
          )}
        </div>
      </header>
      
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
        defaultMode={authMode}
      />
    </>
  );
}

function App() {
  const { user } = useAuth();
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar user={user} />
            <div className="flex flex-col flex-1 overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-auto">
                <Router />
                <Footer />
              </main>
            </div>
          </div>
          <ChatButton />
          <Toaster />
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
