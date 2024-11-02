import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const Visualization = () => {
    return (
        <>
            <Tabs defaultValue="overview" className="my-4 mx-5">
                <TabsList>
                    <TabsTrigger autoFocus value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger value="reports">
                        Reports
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        Notifications
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    sdfsdfsdf
                </TabsContent>
                <TabsContent value="reports">
                    s24234234234
                </TabsContent>
            </Tabs>
        </>
    )
}

export default Visualization;