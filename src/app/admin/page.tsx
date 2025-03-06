import TestNameInfo from "@/components/page-components/admin/test-name-info";
import AddTestThingsButtons from "@/components/page-components/admin/add-test-things-button";

const Admin = () => {
  return (
    <div className="flex flex-col w-full items-center px-20 pt-10">
      <TestNameInfo />
      <AddTestThingsButtons />
    </div>
  )
}

export default Admin;