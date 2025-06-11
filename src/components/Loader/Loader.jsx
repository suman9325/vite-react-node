import { Fragment } from "react";
import { ThreeCircles } from "react-loader-spinner";

const Loader = (props) => {

    return (
        <Fragment>
            <ThreeCircles
                visible={props.visible}
                height="50"
                width="50"
                ariaLabel="vortex-loading"
                wrapperStyle={{}}
                wrapperClass="vortex-wrapper"
                colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
            />
        </Fragment>
    )
}

export default Loader;