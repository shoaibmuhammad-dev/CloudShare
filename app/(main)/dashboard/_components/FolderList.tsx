import FolderCard from "./FolderCard";

const FOLDERS = [
  {
    id: 1,
    name: "Design Assets",
    items: 24,
    size: "1.2 GB",
    shared: true,
    lastModified: "2 hours ago",
  },
  {
    id: 2,
    name: "Project Documents",
    items: 12,
    size: "450 MB",
    shared: false,
    lastModified: "Yesterday",
  },
  {
    id: 3,
    name: "Marketing Campaigns",
    items: 8,
    size: "2.4 GB",
    shared: true,
    lastModified: "Last week",
  },
  {
    id: 4,
    name: "Financial Reports",
    items: 4,
    size: "120 MB",
    shared: false,
    lastModified: "Oct 12, 2023",
  },
  {
    id: 5,
    name: "Client Presentations",
    items: 15,
    size: "890 MB",
    shared: true,
    lastModified: "Oct 10, 2023",
  },
  {
    id: 6,
    name: "Personal Backups",
    items: 104,
    size: "15.6 GB",
    shared: false,
    lastModified: "Sep 28, 2023",
  },
];

export function FolderList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {FOLDERS.map((folder) => (
        <FolderCard folder={folder} key={folder.name} />
      ))}
    </div>
  );
}
