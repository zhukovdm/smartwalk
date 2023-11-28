using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Algorithms;

namespace SmartWalk.Core.Test;

[TestClass]
public class GeometryTests
{
    [TestMethod]
    public void AngleIsAlwaysValid()
    {
        for (int lon = -1; lon < 2; ++lon)
        {
            for (int lat = -1; lat < 2; ++lat)
            {
                var rads = Spherical.RotAngle(new(0.0, 0.0), new((double) lon, (double) lat));
                var degs = Spherical.RadToDeg(rads);
                Assert.IsTrue(degs <= +180.0);
                Assert.IsTrue(degs >= -180.0);
            }
        }
    }
}
