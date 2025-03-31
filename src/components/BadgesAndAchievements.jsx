import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Award, 
  Medal, 
  ShieldCheck, 
  Lock, 
  Share2, 
  X,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";

export default function BadgesAndAchievements() {
  const [selectedTab, setSelectedTab] = useState("badges");
  const { user } = useUser();
  const clerkId = user?.id;
  const [badgesData, setBadgesData] = useState([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false)


  
    useEffect(() => {
      // Apply dark mode class to body
      if (isDarkMode) {
        document.body.classList.add("dark")
      } else {
        document.body.classList.remove("dark")
      }
    }, [isDarkMode])

  // Fetch badges data from the API when clerkId is available
  useEffect(() => {
    if (clerkId) {
      fetch(`https://server.datasenseai.com/badges/${clerkId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setBadgesData(data.badges);
          } else {
            console.error("Failed to fetch badges:", data);
          }
        })
        .catch((error) => console.error("Error fetching badges:", error));
    }
  }, [clerkId]);

  // Flatten and map the badges data from the API response
  const allBadges = badgesData.flatMap((category) =>
    category.badges.map((badge) => ({
      id: `${category.category}-${badge.name}`, // Unique ID using category and badge name
      name: badge.name,
      description: badge.description,
      icon: <Medal className="h-10 w-10 text-yellow-400" />, // Default icon
      acquired: badge.achieved,
      date: badge.achieved ? "Achieved" : null, // Simplified date display
      rarity: "Common", // Default rarity since not provided by API
      progress:
        badge.progress !== null ? badge.progress : badge.achieved ? 100 : 0, // Handle null progress
    }))
  );

  // Calculate summary statistics
  const totalBadges = allBadges.length;
  const achievedBadges = allBadges.filter((badge) => badge.acquired).length;

  // Handle share button click
  const handleShareClick = (badge) => {
    setSelectedBadge(badge);
    setShareDialogOpen(true);
  };

  // Copy badge share link to clipboard
  const copyToClipboard = () => {
    const shareUrl = `https://datasenseai.com/badge/${selectedBadge.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share to social media
  const shareToSocial = (platform) => {
    const shareUrl = `https://datasenseai.com/badge/${selectedBadge.id}`;
    const shareText = `I just earned the "${selectedBadge.name}" badge in Bullet Surge! Check it out!`;
    
    let socialUrl = '';
    
    switch (platform) {
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        socialUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(socialUrl, '_blank', 'width=600,height=400');
  };

  // Sample certificates data (unchanged since API doesn't provide certificates)
  const certificates = [
    {
      id: 1,
      name: "Bullet Surge Fundamentals",
      description: "Mastery of basic game mechanics and strategies",
      icon: <ShieldCheck className="h-10 w-10 text-yellow-400" />,
      acquired: true,
      date: "Feb 10, 2025",
      issuer: "Bullet Surge Academy",
    },
    {
      id: 2,
      name: "Advanced Problem Solving",
      description: "Demonstrated exceptional problem-solving abilities",
      icon: <ShieldCheck className="h-10 w-10 text-blue-400" />,
      acquired: true,
      date: "Feb 15, 2025",
      issuer: "Bullet Surge Academy",
    },
    {
      id: 3,
      name: "Tournament Competitor",
      description: "Participated in seasonal tournament",
      icon: <ShieldCheck className="h-10 w-10 text-green-400" />,
      acquired: false,
      progress: 0,
      requirements: "Participate in the upcoming Spring Tournament",
    },
    {
      id: 4,
      name: "Master Strategist",
      description: "Demonstrated advanced game strategies",
      icon: <ShieldCheck className="h-10 w-10 text-purple-400" />,
      acquired: false,
      progress: 75,
      requirements: "Complete the strategy assessment with 90% score",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020817] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            Your Badges and Achievements
          </h1>
          <div className="text-right">
            <div className="text-xl font-semibold text-yellow-400">Level 8</div>
            <div className="text-sm text-slate-400">
              {achievedBadges}/{totalBadges} Badges Unlocked
            </div>
          </div>
        </div>

        {/* Progress Bar (kept as sample data) */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-400">Progress to Level 9</span>
            <span className="text-slate-400">450/1000 XP</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[45%] bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
          </div>
        </div>

        <Tabs
          defaultValue="badges"
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="mb-6 grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger
              value="badges"
              className="data-[state=active]:bg-slate-700"
            >
              <Award className="mr-2 h-4 w-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger
              value="certificates"
              className="data-[state=active]:bg-slate-700"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`border-slate-800 ${
                    badge.acquired ? "bg-slate-800/50" : "bg-slate-800/20"
                  } p-6 transition-all hover:bg-slate-800 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50">
                      {badge.acquired ? (
                        badge.icon
                      ) : (
                        <Lock className="h-8 w-8 text-slate-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium bg-slate-700 text-slate-300`}
                      >
                        {badge.rarity}
                      </span>
                      {badge.acquired && (
                        <button 
                          className="rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
                          onClick={() => handleShareClick(badge)}
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {badge.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {badge.description}
                  </p>

                  {badge.acquired ? (
                    <div className="mt-4 text-xs text-green-400">
                      {badge.date}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-slate-400">{badge.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ width: `${badge.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2">
              {certificates.map((cert) => (
                <Card
                  key={cert.id}
                  className={`border-slate-800 ${
                    cert.acquired ? "bg-slate-800/50" : "bg-slate-800/20"
                  } p-6 transition-all hover:bg-slate-800 hover:shadow-lg`}
                >
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700/50">
                      {cert.acquired ? (
                        cert.icon
                      ) : (
                        <Lock className="h-8 w-8 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {cert.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {cert.description}
                      </p>
                    </div>
                  </div>

                  {cert.acquired ? (
                    <div className="mt-4 flex justify-between border-t border-slate-700 pt-4">
                      <div>
                        <div className="text-xs text-slate-500">Issued by</div>
                        <div className="font-medium text-slate-300">
                          {cert.issuer}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Issue Date</div>
                        <div className="font-medium text-slate-300">
                          {cert.date}
                        </div>
                      </div>
                      <button className="ml-4 rounded-md bg-yellow-500 px-3 py-1 text-sm font-medium text-slate-900 hover:bg-yellow-400">
                        View
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 border-t border-slate-700 pt-4">
                      <div className="mb-2 text-sm text-slate-400">
                        Requirements:
                      </div>
                      <p className="text-sm text-slate-500">
                        {cert.requirements}
                      </p>

                      {cert.progress > 0 && (
                        <div className="mt-4">
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-slate-400">
                              {cert.progress}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                              style={{ width: `${cert.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Achievements Summary */}
        <Card className="mt-8 border-slate-800 bg-slate-800/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Achievements Summary
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-lg bg-slate-800 p-4 text-center">
              <div className="mb-1 text-3xl font-bold text-white">
                {achievedBadges}/{totalBadges}
              </div>
              <div className="text-sm text-slate-400">Badges Earned</div>
            </div>
            <div className="rounded-lg bg-slate-800 p-4 text-center">
              <div className="mb-1 text-3xl font-bold text-white">2/4</div>
              <div className="text-sm text-slate-400">Certificates Earned</div>
            </div>
            <div className="rounded-lg bg-slate-800 p-4 text-center">
              <div className="mb-1 text-3xl font-bold text-white">450</div>
              <div className="text-sm text-slate-400">Achievement XP</div>
            </div>
            <div className="rounded-lg bg-slate-800 p-4 text-center">
              <div className="mb-1 text-3xl font-bold text-green-400">33%</div>
              <div className="text-sm text-slate-400">Completion Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Share Badge</DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          
          {selectedBadge && (
            <div className="p-4">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                  <Medal className="h-10 w-10 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedBadge.name}</h3>
                  <p className="text-sm text-slate-400">{selectedBadge.description}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="mb-2 text-sm text-slate-400">Share on social media</p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full border-slate-700 bg-slate-800 hover:bg-slate-700"
                    onClick={() => shareToSocial('twitter')}
                  >
                    <Twitter className="h-5 w-5 text-blue-400" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full border-slate-700 bg-slate-800 hover:bg-slate-700"
                    onClick={() => shareToSocial('facebook')}
                  >
                    <Facebook className="h-5 w-5 text-blue-600" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full border-slate-700 bg-slate-800 hover:bg-slate-700"
                    onClick={() => shareToSocial('linkedin')}
                  >
                    <Linkedin className="h-5 w-5 text-blue-500" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="mb-2 text-sm text-slate-400">Or copy link</p>
                <div className="flex">
                  <div className="flex-1 rounded-l-md bg-slate-800 px-3 py-2 text-sm text-slate-300">
                    {`https://datasenseai.com/badge/${selectedBadge.id}`}
                  </div>
                  <Button 
                    className="rounded-l-none bg-yellow-500 hover:bg-yellow-400 text-slate-900"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}