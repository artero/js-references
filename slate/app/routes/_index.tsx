import BasicEditor from "~/components/BasicEditor";
import AddChildInSelection from "~/components/AddChildInSelection";
import ViewerComponent from "~/components/ViewerComponent";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">BasicEditor</h2>
        <BasicEditor />
        <hr className="my-8" />
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          AddChildInSelection
        </h2>
        <AddChildInSelection />
        <hr className="my-8" />
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Serialize</h2>
        <ViewerComponent
          content={
            "hello\n\n\n <orchestra_dataset_id>1</orchestra_dataset_id> foobar\n <orchestra_dataset_id>1</orchestra_dataset_id> foobar"
          }
        />
      </div>
    </div>
  );
}
