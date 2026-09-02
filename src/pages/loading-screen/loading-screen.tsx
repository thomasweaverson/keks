import Loader from "../../components/loader/loader";
import styles from "./loading-screen.module.css";

const LoaderScreen = () => (
  <div className={styles.container}>
    <Loader />
  </div>
);

export default LoaderScreen;
