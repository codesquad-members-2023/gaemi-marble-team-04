package codesquad.gaemimarble;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;

public class Test1 {
	@Test
	void map() {
		Map<Integer, Integer> map = new HashMap<>();
		Integer a = map.get(1);
		System.out.println(a);
	}

	@Test
	void random() {
		int randomIndex = (int)(Math.random() * 2) + 1;
		System.out.println(randomIndex);
		randomIndex = (int)(Math.random() * 2) + 1;
		System.out.println(randomIndex);
		randomIndex = (int)(Math.random() * 2) + 1;
		System.out.println(randomIndex);
		randomIndex = (int)(Math.random() * 2) + 1;
		System.out.println(randomIndex);
		randomIndex = (int)(Math.random() * 2) + 1;
		System.out.println(randomIndex);
		randomIndex = (int)(Math.random() * 2) + 1;
		System.out.println(randomIndex);
		randomIndex = (int)(Math.random() * 2) + 1;
		System.out.println(randomIndex);
		randomIndex = (int)(Math.random() * 2) + 1;
		System.out.println(randomIndex);
	}

	@Test
	void waitTest() {
		long startTime = System.currentTimeMillis();
		for (int i = 0; i < 10; i++) {
			try {
				Thread.sleep(1_000);
				System.out.println(i);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		long endTime = System.currentTimeMillis();

		System.out.println(endTime - startTime);
	}
}
