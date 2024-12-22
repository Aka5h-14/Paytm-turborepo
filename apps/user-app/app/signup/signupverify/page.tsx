import OtpInput from "../../components/OtpInputPage"
import { otpEmailSend } from "../../lib/actions/otpEmailsend";

export default async function SignUpVerify(){
    const res = await otpEmailSend();
    console.log(res);

    return <div> 
        <OtpInput/>
    </div>
}