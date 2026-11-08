
import Link from "next/link";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RegisterPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <div className="w-full max-w-2xl space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">
                        Create Customer Account
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>

                        <CardContent>
                            <Link href="/register/business">
                                <Button className="w-full">
                                    Create Business Account
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>

                        <CardContent>
                            <Link href="/register/customer">
                                <Button className="w-full">
                                    Create Shopper Account
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;