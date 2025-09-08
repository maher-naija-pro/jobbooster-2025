import { ArrowRight, LogIn, Settings, User, User2Icon, UserX2Icon, X, Shield, Lock, Mail, Loader2 as Spinner, FileText, Bookmark, Briefcase, Search, Eye, Calendar, AlertCircle, Zap } from "lucide-react"
import { HiOutlineTrash } from "react-icons/hi2";
import { FileUp, Plus, Loader2 } from "lucide-react";
import { MdContentCopy } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { BsChevronDown, BsChevronLeft, BsChevronRight, BsChevronUp, BsFire } from "react-icons/bs"
import { FaGithub, FaDiscord, FaLinkedin, FaTwitter } from "react-icons/fa"
export const Icons = {
  // Navigation
  back: BsChevronLeft,
  next: BsChevronRight,
  up: BsChevronUp,
  down: BsChevronDown,
  //platform
  Copy: MdContentCopy,
  FaCheck: FaCheck,
  FileUp: FileUp,
  Plus: Plus,
  Loader2: Loader2,
  login: LogIn,
  clean: X,
  trash: HiOutlineTrash,
  profile: User2Icon,
  employee: UserX2Icon,
  settings: Settings,
  user: User,
  arrowRight: ArrowRight,
  // Security & Auth
  shield: Shield,
  lock: Lock,
  mail: Mail,
  spinner: Spinner,
  // Dashboard icons
  fileText: FileText,
  bookmark: Bookmark,
  briefcase: Briefcase,
  search: Search,
  eye: Eye,
  calendar: Calendar,
  alertCircle: AlertCircle,
  zap: Zap,
  // Social Media
  github: FaGithub,
  discord: FaDiscord,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
}
