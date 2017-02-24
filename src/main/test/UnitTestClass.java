import org.apache.log4j.Logger;
import org.junit.Test;

import static kz.diplom.util.Crypt.MD5;

public class UnitTestClass {

    private static final Logger LOGGER = Logger.getLogger(UnitTestClass.class);

    @Test
    public void generatorPassword() {
        LOGGER.info(MD5("123456"));
    }
}
