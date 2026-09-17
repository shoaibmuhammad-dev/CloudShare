import {
  FileText,
  Image as ImageIcon,
  Video,
  File,
  MoreVertical,
  Download,
} from "lucide-react";

type FileType = "pdf" | "image" | "video" | "doc" | "sheet";

interface FileItem {
  id: number;
  name: string;
  type: FileType;
  size: string;
  uploadedAt: string;
}

const FILES: FileItem[] = [
  {
    id: 1,
    name: "Q3_Financial_Report.pdf",
    type: "pdf",
    size: "4.2 MB",
    uploadedAt: "Oct 14, 2023",
  },
  {
    id: 2,
    name: "Hero_Image_v2.png",
    type: "image",
    size: "8.1 MB",
    uploadedAt: "Oct 12, 2023",
  },
  {
    id: 3,
    name: "Client_Meeting_Notes.docx",
    type: "doc",
    size: "1.2 MB",
    uploadedAt: "Oct 10, 2023",
  },
  {
    id: 4,
    name: "Product_Demo.mp4",
    type: "video",
    size: "145 MB",
    uploadedAt: "Sep 28, 2023",
  },
  {
    id: 5,
    name: "Budget_Forecast.xlsx",
    type: "sheet",
    size: "3.4 MB",
    uploadedAt: "Sep 25, 2023",
  },
];

const getFileIcon = (type: FileType) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />;

    case "image":
      return <ImageIcon className="h-5 w-5 text-blue-500" />;

    case "video":
      return <Video className="h-5 w-5 text-purple-500" />;

    case "doc":
      return <FileText className="h-5 w-5 text-blue-600" />;

    case "sheet":
      return <FileText className="h-5 w-5 text-green-600" />;

    default:
      return <File className="h-5 w-5 text-slate-500" />;
  }
};

export function FileList() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Name
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Size
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                Uploaded
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {FILES.map((file) => (
              <tr
                key={file.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      {getFileIcon(file.type)}
                    </div>

                    <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                      {file.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {file.size}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden sm:table-cell">
                  {file.uploadedAt}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="text-slate-400 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-600 p-2 rounded-md hover:bg-slate-100 transition-colors"
                      title="More actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
