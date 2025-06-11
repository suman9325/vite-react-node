import { Bounce, toast } from "react-toastify";

export const TOAST_TYPE = {
    SUCCESS: "success",
    ERROR: "error",
    INFO: "info",
    WARNING: "warning"
}

export const toastAlert = (type, msg) => {
    if (type === TOAST_TYPE.SUCCESS)
        toast.success(msg);
    else if (type === TOAST_TYPE.ERROR)
        toast.error(msg);
    else if (type === TOAST_TYPE.INFO)
        toast.info(msg);
    else if (type === TOAST_TYPE.WARNING)
        toast.warning(msg);

}